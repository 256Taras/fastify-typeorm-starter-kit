# Modules folder

Each folder defines a route to an endpoint in your application.

In this folder you should define all the routes that define the endpoints
of your web application.
Each module is a [Fastify
plugin](https://www.fastify.io/docs/latest/Plugins/), it is
encapsulated (it can have its own independent plugins).
The application server works in such a way that you create a folder and place there a file with the prefix [module-name].router.[api-version].js and based on this your routes are built.

- If you need to share functionality between routes, place that
  functionality into the `plugins` folder, and share it via
  [decorators](https://www.fastify.io/docs/latest/Decorators/).

- If you need to share common functionality for modules for business logic, add the sharer to the 'common/infra/services' folder, each such file will be automatically loaded via  [@fastify/awilix](https://github.com/fastify/fastify-awilix) and made available to your use-cases through the first parameter

- If you need to share code between your use-cases, you can export it to `your-module/services/your.service.js`
  folder

- A good practice would be to make the modules similar, for each entity the data structures should be the same.

- If you have more than one service or orm model, move it to a folder such as `services` `entities`

- If you need to quickly add a module with `CRUD` operations, you can run the command `yarn module [your-module-name]` which will create all the base files.
-
- If you're a bit confused about using async/await to write routes, you would better take a look at Promise resolution for more details.