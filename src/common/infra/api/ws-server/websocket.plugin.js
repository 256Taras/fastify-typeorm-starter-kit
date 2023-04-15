import websocket from "@fastify/websocket";
import fp from "fastify-plugin";
import Ajv from "ajv";
import { globalWebSocketFastifyErrorHandler } from "#common/errors/fastify-error-handler.js";

const ajv = new Ajv();

async function websocketPlugin(app) {
  const sockets = {};

  app.register(websocket);

  app.register(async (server) => {
    server.get("/ws", { websocket: true }, (connection /* SocketStream */ /* req: FastifyRequest */) => {
      connection.socket.on("message", async (message) => {
        try {
          const { name, method, payload } = JSON.parse(message);
          if (!name || !method) {
            connection.send(JSON.stringify({ message: "Invalid message" }), { binary: false });
            return;
          }
          const socketData = sockets?.[name]?.[method];
          if (!socketData) {
            connection.send(JSON.stringify({ error: "Not found" }), { binary: false });
            return;
          }
          const { handler, schema } = socketData;
          const validateInput = ajv.compile(schema.input);
          const validInput = validateInput(payload);
          if (!validInput) {
            connection.send(JSON.stringify({ error: ajv.errorsText(validateInput.errors) }), {
              binary: false,
            });
            return;
          }
          const result = await handler(payload);
          if (schema.output) {
            const validateOutput = ajv.compile(schema.output);
            const validatedOutput = validateOutput(result);
            if (!validatedOutput) {
              connection.send(JSON.stringify({ error: ajv.errorsText(validateOutput.errors) }), {
                binary: false,
              });
              return;
            }
            connection.send(JSON.stringify({ result: validatedOutput }));
            return;
          }
          connection.send(JSON.stringify({ result }));
        } catch (err) {
          const error = await globalWebSocketFastifyErrorHandler(err);
          connection.send(error, { binary: false });
        }
      });
    });
  });

  app.decorate("socket", (method, options) => {
    if (!method) throw Error("Socket method name require");
    const { schema, preHandler, handler, name } = options;
    sockets[name][method] = { schema, preHandler, handler };
  });
}

export default fp(websocketPlugin);

// fastify.socket("method", {
//   name: 'name'
//   schema: schemas.testSchema,
//   preHandler: broadcast,
//   handler: testHandler,
// });
