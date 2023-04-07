export default {
  check: {
    tags: ["dev"],
    // You can define different schemas
    // based on the response status code.
    // Be aware that if you are using a response
    // schema and you don't define property, this property
    // will not be serialized in the final response, even if you
    // are returing it in your route handler.
    response: {
      // You can define different schemas
      // based on the response status code.
      // Be aware that if you are using a response
      // schema and you don't define property, this property
      // will not be serialized in the final response, even if you
      // are returing it in your route handler.
      200: {
        // The description field will be used by the swagger
        // generator to describe the route.
        // description: 'Returns status and version of the application',
        type: "string",
      },
    },
  },
};
