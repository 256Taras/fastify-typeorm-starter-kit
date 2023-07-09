# Modules folder

Each folder defines a route to an endpoint in your application.

In this folder you should define all the routes which define the endpoints
of your web application.
Each module is a [Fastify
plugin](https://www.fastify.io/docs/latest/Plugins/), it is
encapsulated (it can have its own independent plugins).
The application server works in such a way that you can create a folder and place a file there with the prefix [module-name].router.[api-version].js and based on this your routes are built.

Here are some best practices to keep in mind:

- If you need to share functionality between routes, place that
  functionality into the `plugins` folder, and share it via
  [decorators](https://www.fastify.io/docs/latest/Decorators/).

- If you need to share common functionality for modules for business logic, add the sharer to the 'common/infra/services' folder, each such file will be automatically loaded via  [@fastify/awilix](https://github.com/fastify/fastify-awilix) and made available to your use-cases through the first parameter

- If you need to share code between your use-cases, you can export it to `your-module/services/your.service.js`
  folder

- A good practice would be to make the modules similar, for each entity the data structures should be the same.

- If you have more than one service or orm model, move it to a folder such as `services` `entities`

- If you're a bit confused about using async/await to write routes, you would better take a look at Promise resolution for more details.

## Module Generator

Module Generator is a script that automatically generates code for a new module in your application, based on your specifications. This includes files for models, schemas, routes, and types, structured in the directory pattern of your application.

### How to Use

Run the generator using the following command:

```shell
node infra/bin/create-module.js name=ModuleName fields='field1:type1(10), field2:type2, field3?:type3'
```
Replace ModuleName with the desired name for your new module, and field1:type1, field2:type2 with your desired field names and their respective types.

If the field should be optional, append a ? to the field name. If the field should be unique, append a ! to the field name.

For example:

```shell
    node infra/bin/create-module.js name=User fields='firstName:string, lastName:string, email:string!, password:string!, bio?:text'
```

This will generate a User module with fields firstName, lastName, email, password, and an optional bio, where email and password are unique.

After running the script, the files for the new module will be created in the src/modules directory.


#### What Does It Do?

The script generates the necessary files for a new module in your application. This includes:

     .entity.js file containing the ORM model for the module, including any relations.
     .schemas.js file containing the validation schemas for the module.
     .router.v1.js file containing the routes for the module.
     .types.d.ts file containing the type definitions for the module.

The script also runs Prettier on the generated files to ensure they follow your code formatting standards.

The script simplifies the process of adding new modules to your application, ensuring that each module follows the same structure and conventions.

## Generating Relationships

The generator can also create relationships between entities. To specify a relationship, use the following syntax:

`[<|>EntityName-(one-to-many|many-to-one|many-to-many)]`

For example:

```shell
node infra/bin/create-module.js name=User fields="firstName:string, lastName:string, age?:integer, email!:string, password:string, roles:[>Role-many-to-many]"
```

This will generate a User module with a many-to-many relationship to the Role module. The > sign indicates that the User entity is the owner of the relationship.

Field names should follow camelCase convention and module names should follow PascalCase.
