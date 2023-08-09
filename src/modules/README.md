## 🧩 Modules Folder

This directory is responsible for managing the routes to your application's endpoints. Every subdirectory here signifies a distinct endpoint, with each module behaving as a Fastify plugin endowed with its own encapsulation capabilities.

**Folder Structure Guide**:
- Name your file as `[module-name].router.[api-version].js` inside its designated folder to configure its routes.

### Best Practices:

- **Shared Route Functionality**: When functionality across routes overlaps, put this in the [Fastify
  plugin](https://www.fastify.io/docs/latest/Plugins/) folder and share it using [Fastify decorators](https://www.fastify.io/docs/latest/Decorators/).
- **Shared Module Logic**: For mutual business logic across modules, go to the `common/infra/services` folder. Files here are auto-loaded with `@fastify/awilix`.
- **Shared Use-Case Code**: Export to `your-module/services/your.service.js`.
- **Uniformity Across Modules**: Ensure that modules are alike and that data structures are consistent.
- **Grouping Multiple Services or ORM Models**: Organize them under folders like `services` or `entities`.
- **Async/Await Utilization in Routes**: If this feels daunting, revisit the fundamentals of Promise resolution.

---
## ⚙️ Module Generator

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
