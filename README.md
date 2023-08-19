# ⬢ Node.js Application Development Starter Kit ⬢

The Starter Kit offers tools and features tailored for efficient application development using Node.js. It aims to streamline the process, especially for MVPs and scalable applications.

## 🗝️ Key Features & Benefits:

- **Modular MVC Structure**: Organized pattern for application development.
- **Latest Node.js Capabilities**: Utilize contemporary Node.js features without relying on Babel or TypeScript.
- **Fastify Integration**: Fast and efficient HTTP servers with asynchronous support.
- **TypeORM Database Integration**: Simplified database connectivity and operations.
- **Architectural Flexibility**: Suitable for MVPs, with easy adaptability for future architectural shifts.
- **Alternative to Nest.js**: Offers core functionalities without additional complexities.
- **Optimized Infrastructure**: Prioritizes efficiency and performance.
- **Clear Code Base**: Organized structure for easier navigation and modification.
- **Adaptable Components**: Components designed for customization based on project requirements.

## 📚 Prerequisites

We assume that everyone who comes here is **`programmer with intermediate knowledge`** and we also need to understand more before we begin in order to reduce the knowledge gap.

1. Understand [Fastify Fundamental](https://www.fastify.io/docs/latest/), Main Framework. Fast and low overhead web framework, for Node.js
2. Understand [Express Fundamental](https://expressjs.com/en/starter/installing.html), NodeJs Base Framework. Since the project is based on fastify, which is trying to solve problems specifically express
3. Understand The YAGNI Principle and KISS Principle for better write the code.
4. Optional. Understand[Typescript Fundamental](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), Programming Language. It will help to write us contacts of types
5. Optional. Understanding [The Twelve Factor Apps](https://12factor.net/). It can help to serve the project.
6. Optional. Understanding [Docker](https://docs.docker.com/get-started/). It can help to run the project.

## ⚠️ Requirements

| Name           | Version  |
|----------------|----------|
| Node           | v18.7.x  |
| Typescript     | v4.9.x   |
| PostgreSQL     | v15.0.x  |
| Yarn           | v1.22.x  |
| NPM            | v8.19.x  |
| Docker         | v18.10.x |
| Docker Compose | v1.23.x  |


## 📌 Getting Started

Before start, we need to install some packages and tools.
The recommended version is the LTS version for every tool and package.

> Make sure to check that the tools have been installed successfully.

- [NodeJs](https://nodejs.org/en)
- [Docker](https://docs.docker.com/get-docker/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Clone Repo

1. Clone the project with git.

  ```bash
git clone https://github.com/Ezen1programmer/fastify-typeorm-starter-kit
  ```

### Install Dependencies
*Optional*: Use `nvm use` command which automatically will setup `node` of specified version in `.nvmrc` file.

2. This project needs some dependencies. Let's go install it.

  ```bash
yarn install
  ```


### Create environment

3. Create `.environment` file in `configs` folder. Use `.environment.example` as example.
`.environment.example` has already fully functional settings, so server can be started with it without changes

  ```bash
cp .environment.example .environment
  ```


### Database Migration

4. Run migrations

  ```bash
yarn typeorm:migration:run
  ```

## 🏃 Run Project

1. Run infrastructure in docker (db, etc.):

 ```bash
   yarn docker:infra:up
 ```

2. Run server on local machine without docker:

 ```bash
   yarn start
 ```

Finally, Cheers 🍻🍻 !!! you passed all steps.

## API Reference

You can check The ApiSpec after running this project. [here](http://localhost:8000/docs/static/index.html)


## 🧪 Testing

1. Run infrastructure in docker (db, etc.):

  ```bash
yarn docker:infra:up
  ```

The project provide 3 automation testing `unit testing`, `integration testing`, and `e2e testing`.

  ```bash
yarn test
  ```

For specific test do this

* Unit testing

    ```bash
    yarn test:unit
    ```

* Integration testing

    ```bash
    yarn test:integration
    ```

* E2E testing

    ```bash
    yarn test:e2e
    ```

## 📜 Scripts

   - `audit` - runs an npm audit to check for any security vulnerabilities
   - `start` - starts the application by running the main file index.js
   - `start:dev` - starts the application in development mode and pipes the logs through the pino-pretty package to make them more readable
   - `start:dev:watch` - starts the application in development mode and watches for changes in the files using the --watch flag and pipes the logs through pino-pretty
   - `start:stage` - starts the application in staging mode using pm2 with a custom name- `api-stage"` -- `start:prod` - starts the application in production mode using pm2 with a custom name- `api-prod"` -- `docker:dev:up` - starts the development environment with docker-compose by running the docker-compose.yml and docker-compose.dev.yml files
   - `docker:dev:down` - stops the development environment with docker-compose by running the docker-compose.yml and docker-compose.dev.yml files
   - `docker:infra:up` - starts the infrastructure services (e.g. database) with docker-compose by running the docker-compose.yml file
   - `docker:infra:down` - stops the infrastructure services with docker-compose by running the docker-compose.yml file
   - `typeorm:migration:create` - creates a new migration file using TypeORM
   - `typeorm:migration:generate` - generates a new migration file using TypeORM
   - `typeorm:migration:run` - runs any pending TypeORM migrations
   - `typeorm:migration:revert` - reverts the last TypeORM migration
   - `typeorm:seed:create` - creates a new database seed file
   - `typeorm:seed:run` - runs the database seed file
   - `test` - runs both unit and integration tests
   - `test:unit` - runs unit tests using c8 to check for code coverage
   - `test:integration` - runs integration tests without coverage and with a limit of one job
   - `stage` - starts the application in staging mode and saves the process list with pm2
   - `stage:restart` - restarts the application in staging mode using pm2
   - `stage:delete` - stops and deletes the process in staging mode with pm2
   - `prod` - starts the application in production mode and saves the process list with pm2
   - `prod:restart` - restarts the application in production mode using pm2
   - `prod:delete` - stops and deletes the process in production mode with pm2
   - `lint` - runs the linter (eslint) on all relevant files
   - `lint:fix` - runs the linter with the --fix flag to fix any fixable errors
   - `prettier:fix` - runs prettier to format relevant files
   - `prepare` - installs husky as a git hook manager
   - `precommit` - runs linting and testing before committing changes
   - `prepush` - runs linting and testing before pushing changes
   - `module` - creates a new module with the given name
   - `check` - runs TypeScript's type checker (tsc) with the configuration file tsconfig.json
   - `ci` - runs a series of commands for continuous integration, including formatting, linting, testing, and type checking.

## 🤌 Development culture

- split by modules (scalability & better dev experience)
- store as much as can boilerplate code in shared
- has additional layers for easy cognitive perception:
  - handlers
  - services
  - scopes (extracted from infra)

## 🔐 Git & Commit culture

Prefer to use [Git Flow process](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

**Commit culture is based on [this article](https://chris.beams.io/posts/git-commit), here are seven simple rules:**

1. [Separate subject from body with a blank line](https://chris.beams.io/posts/git-commit/#separate)
2. [Limit the subject line to 50 characters](https://chris.beams.io/posts/git-commit/#limit-50)
3. [Capitalize the subject line](https://chris.beams.io/posts/git-commit/#capitalize)
4. [Do not end the subject line with a period](https://chris.beams.io/posts/git-commit/#end)
5. [Use the imperative mood in the subject line](https://chris.beams.io/posts/git-commit/#imperative)
6. [Wrap the body at 72 characters](https://chris.beams.io/posts/git-commit/#wrap-72)
7. [Use the body to explain what and why vs. how](https://chris.beams.io/posts/git-commit/#why-not-how)


Commit Convention is described in [this article](https://www.conventionalcommits.org/en/v1.0.0-beta.4/), here are seven simple rules:

1. Each commit message consists of a header, a body, and a footer.

```
   <header>
   <BLANK LINE>
   <body>
   <BLANK LINE>
   <footer>
```

- The header is mandatory and must conform to the Commit Message Header format.
- The body is mandatory for all commits except for those of type "docs".
  When the body is present it must be at least 20 characters long and must conform to the Commit Message Body format.
- The footer is optional. The Commit Message Footer format describes what the footer is used for and the structure it must have.

2. Commit Message Header

## Format of the commit message

```
<type>(<scope>): <short summary>
│       │             │
│       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
│       │
│       └─⫸ Commit Scope: common|core|account-crud|migrations
│
└─⫸ Commit Type: build|docs|feat|fix|refactor|test
```

The <type> and <summary> fields are mandatory, the (<scope>) field is optional.

3. Type

   Must be one of the following:

- build: Changes that affect the build system or external dependencies (example scopes: npm, infra)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests

4. Scope

   Usually the scope should be the name of task.

- none/empty string: useful for test and refactor changes that are done across all packages (e.g. `test: add missing unit tests`) and for docs changes that are not related to a specific package (e.g. `docs: fix typo in tutorial`).

5. Summary

   Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

6. Commit Message Body

   Use the body to explain what and why vs. how

7. Commit Message Footer

   The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.


## 💡 Features

- [x] production ready
- [x] automatic loading of modules and plugins
- [x] validate environment:
- [x] main script: initialize infra for proper server start, start server, add server stop handlers
- [x] graceful shutdown
- [x] configs: separate folder, split by files, setup using process environment
- [x] fastify application server
- [x] auto documentation: fastify-swagger. \*Require fastify input & output schemas
- [x] routers with input validation
- [x] separate router handler
- [x] logger powered by 'pino'
  - [x] console interface
  - [x] log levels
  - [x] trace ID
- [x] loggerService service implementation with LOG_LEVELs: wrapped pino into console.log interface
- [x] containerize in docker server and all 3rd parties if possible:
  - [x] server
  - [x] db (postgres)
- [x] DI: At the file system level
- [x] TDD: node:test or tap, DI, unit-tests, e2e
- [x] CI/CD based on gitlab
- [x] [Simplified architecture based on Clean Architecture] (#architecture-description-&-maintain-instructions)
- [x] db:
  - [x] typeorm
  - [x] postgres
  - [x] separate loggerService for db logging
  - [ ] cursor pagination
- [x] local code style support:
  - [x] esLint setup
  - [x] prettier setup
  - [x] editorconfig
  - [x] optional: words spelling checker (VScode plugin)
- [x] built-in Auth:
  - [x] bearer token (JWT) (Manually)
  - [x] API_KEY (Manually)
- [x] permissions checks:
  - [x] permissions based access (Something like this, may be used to implement storing access: https://blog.logrocket.com/using-accesscontrol-for-rbac-and-abac-in-node-js/)
  - [ ] roles based (https://www.nearform.com/blog/access-control-node-js-fastify-and-casbin/)
- [ ] http requests async queue (https://github.com/autotelic/fastify-queue/blob/main/index.js)
- [x] rate limiting (https://www.npmjs.com/package/fastify-rate-limit)
  - [x] global rate limit
  - [x] rate limit per route
- [x] request timeouts (implement manually, example: https://github.com/fastify/fastify-http-proxy/issues/74)
- [x] request-scoped storage support, based on Asynchronous Local Storage to receive data without mutation request
- [x] templates rendering support
- [x] ability to run CPU intensive tasks in the Piscina worker pool
- [x] covering utilities with .d.ts files
- [ ] clustering based on child process
- [x] support Docker installation

## 🙋 FAQ

[View FAQ](docs/faq.md)

## 📝 Docs

- [Project structure](./docs/project-structure.md)
- [Tests](./docs/tests.md)
- [Deploy](./docs/deploy.md)
- [Environment](./docs/env.md)
- [FAQ](./docs/faq.md)
