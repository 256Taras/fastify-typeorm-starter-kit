## 🚀  Description

Template for developing applications based on a modular MVC structure using the latest Node.js features.
This template is ideal for initial development, given that its purpose is to create MVPs. However,
considering the possibility of further project expansion, it can also be used for an easy transition to N-layered or clean architecture in the future.
With this approach, the project can be easily extended as needed, ensuring its stability and flexibility in the future.

The template provides the ability to quickly start developing Node.js applications using Fastify and TypeORM.
Fastify is a fast and efficient web framework for Node.js, and TypeORM is an ORM for Node.js that allows for easy database integration.

The main idea of the template is to help developers create scalable web applications on Node.js using the latest Node.js features without using Babel or TypeScript.
The template is a simplified alternative to the Nest.js framework, yet it maintains simplicity and ease of use, providing the following benefits:

- Less infrastructure dependency: Fastify allows for quickly creating small, efficient HTTP servers, which are a lighter option compared to other frameworks like Express or Nest.js.

- Simplicity: Fastify offers a simple yet powerful system of middleware and plugins, making it easy to use and extend.

- High performance: Fastify offers speed compared to other frameworks and supports asynchronous requests.

- Low complexity: Code that uses Fastify is simple and understandable, making it easier for developers to understand and extend.

The template is an excellent option for developing MVPs, as it allows for quickly and efficiently creating web applications. It includes a set of components that help developers create the product in the shortest possible time, such as:

- Well-structured and organized code, simplifying the development and support process.

- Ready-made components that can be easily changed and configured to meet the project's needs.

- The ability to add new components and features to the project without sacrificing stability and flexibility.

## ⚠️ Requirements

- NodeJS v16+
- Npm v8+
- Docker v18+
- Docker Compose v1.23+

## 📌 How to start

1. Copy git repository

2. Create `.env` file in `configs` folder. Use `.env.example` as example.
`.env.example` has already fully functional settings, so server can be started with it without changes
4. *Optional*: Use `nvm use` command which automatically will setup `node` of specified version in `.nvmrc` file.
5. Run this to install the packages  `yarn install`
6. Run migrations `yarn typeorm:migration:run`

## 🏃 Usage

1. Run infrastructure in docker (db, etc.):

   ```bash
   yarn docker:infra:up
   ```

2. Run server on local machine without docker:

   ```bash
   yarn start
   ```

## 🧪 Testing

1. Run infrastructure in docker (db, etc.):

   ```bash
   yarn docker:infra:up
   ```

2. Run tests with command:

   ```bash
   yarn test
   ```

## 📜 Scripts

- `start` - run appPlugin, load & validate env
- `start:dev` - run appPlugin, load & validate env. use pretty print for logs
- `start:dev:dev` - run appPlugin, load & validate env. use pretty print for logs with reload app supported only from node 18.7
- `docker:infra:up` - starts infrastructure (db, adminer) using docker-compose
- `docker:infra:down` - stops docker-compose from "docker:up"

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

- [x] automatic loading of modules and plugins
- [x] validate env:
- [x] main script: initialize infra for proper server start, start server, add server stop handlers
- [x] graceful shutdown
- [x] configs: separate folder, split by files, setup using process env
- [x] fastify application server
- [x] auto documentation: fastify-swagger. \*Require fastify input & output schemas
- [x] routers with input validation
- [x] separate router handler
- [x] Logger powered by 'pino'
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
- [x] WebSockets adapter with support for scheme validation
- [ ] request timeouts (implement manually, example: https://github.com/fastify/fastify-http-proxy/issues/74)
- [x] request-scoped storage support, based on Asynchronous Local Storage to receive data without mutation request
- [x] templates rendering support
- [x] ability to run CPU intensive tasks in the Piscina worker pool
- [x] covering utilities with .d.ts files
- [ ] clustering based on child process
- [ ] utilities for functional programming
   - [x] monads
   - [ ] pattern matching

## 🙋 FAQ

[View FAQ](docs/faq.md)

## 📝 Docs

- [Project structure](./docs/project-structure.md)
- [Tests](./docs/tests.md)
- [Deploy](./docs/deploy.md)
- [Environment](./docs/env.md)
- [FAQ](./docs/faq.md)
