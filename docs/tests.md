# Testing

The project uses the node:test to write tests on top of the tap framework.
All endpoints are covered by integration tests. Test Writing must be Strict Test-Driven Development (TDD) is a development technique in which you must first write a test that has not completed before writing new functional code.
Test-driven development (TDD) is in the mouths of every backend developer, as testing has finally assumed its rightful position as a ‘must-have’ of software engineering. Any company not utilising backend testing is behind the curve.

`Note`. If you just cloned the repository, don't forget to run the npm install command in the terminal


To run a specific type of test, run the command from package.json

- npm run docker:infra:up - run  database via docker-compose

- npm run test:integration - run integration tests


In `integration` tests, each test consists of the test itself and the fixtures for it. Each test run must be in the name of the module which test is being tested and the naming of the tests must strictly follow the name of the use-case.

    .
    ├── ...
    ├── account
    │     └── fixture.js
    │     └── index.test.js
    └── ...


For example, if you want to add tests. Each test must be created with the ending .test.js: this signals to node-tap that this will be the file on which the tests will be run, and it will be automatically checked when the npm command runs the test or npm run test: integration is in progress.
To write a test, we need to import the `createTestingApp` function, which, depending on the endpoint, is passed the authorization service, plugins, configuration, etc., if needed. At the time of writing, there are two types of authorization:
1. JWT token
2. Api-key

If you do not transmit anything, the system will consider the endpoint as public, also, pay attention, we use the "gray box" approach, because we partially know about the authorization method

Let’s talk about what is happening here:

```js

describe(`${TESTING_METHOD}-${getEndpoint()}`, () => {
  const { app, teardown } = createTestingApp();

  beforeEach(async () => {
    await dbUtils.cleanUp();
  });

  after(async () => {
    await teardown();
  });

  it("[201] should  register a new user", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      payload: fixtures.positive.SIGN_UP.in.body,
      path: getEndpoint(),
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(typeof data.accessToken, "string");
    assert.strictEqual(typeof data.user.id, "string");
    // @ts-ignore
    assert.match(response.headers["set-cookie"], /^x-refresh-token=/);
  });
})
```

`describe` is used to group tests which fit together, and it takes two arguments:
a string where you literally describe what is being tested (e.g. According to the recommendations in the best practices, we should name the group as the testing method and the path along the first working endpoint)
a callback function which should include your test setup and assertions

The block tests  one function at a time. Integration tests how well features in or between modules work together. When node-tap runs our test, all tests in that description block will be run in the integration test group.

`it` is what we use to indicate our individual tests, and it again takes two arguments:
- a string which describes what the test should achieve. Notice how descriptive we made the name of the test. For everyone who runs our test, it will immediately become clear what is passed and what is not. A well-tested application is usually a well-documented application, and tests can sometimes be an effective way to document it.
- a callback function with an individual test’s steps

In almost every test in the describe function, we use two utility functions `beforeEach` and `after`:
`BeforeEach` in node-tap is part of the setup and teardown process. As the name suggests, if we want to run a function or other code repeatedly beforeEach test, that code can be placed inside the beforeEach function.
Similarly, node-test also has an afterEach function that will run a piece of code every time the test execution finishes, i.e. the tear down. If we want to run some code only once before all tests are executed, node-tap has a before function for this purpose.
Basically, in `beforeEach`, database cleaning is started in order not to conflict with old data and fixtures are started, which will be discussed below. In `after` we should always call await appPlugin.close(); to stop the test server  if you need different instances of servers for example to test roles, then the test server should be closed in the `it` function

`Fastify` comes with built-in support for fake HTTP injection thanks to light-my-request .inject. It enables us to programmatically send HTTP requests such as GET, `POST, PATCH, PUT, DELETE` to HTTP servers and get results. The .inject ensures all registered plugins have booted up and our application is ready to test. Finally, we pass the request method we want to use and a route. Using await we can store the response without a callback. As for the expectations in the project, we check one of the fields to verify that the system is working, there is no need to check whether all the fields are present as json-schema validator

To populate data In testing, the term commit is used to describe the initial data in storage (for example, the original data in a database) when the application test is first run. Each object with fixtures must be created through the fixture factory to ensure immutability and that another test is not broken.

```js

export const signUpFixtures = fixtureFactory({
  seeds: {
    negative: {
      EMAIL_ALREADY_EXIST: {
        tableName: seedTables.user,
        data: [
          {
            id: AUTHORIZED_MOCK_USER_ID,
            email: EMAIL,
            password: await new EncrypterService().getHash(PASSWORD),
            first_name: FIRSTNAME,
            last_name: LASTNAME,
            roles: JSON.stringify([ROLES_NAMES.user]),
          },
        ],
      },
    },
  },
  positive: {
    SIGN_UP: {
      in: {
        body: COMMON_BODY,
      },
      out: {
        status: { status: true },
      },
    },
  },
  negative: {
    EMAIL_ALREADY_EXIST: {
      in: {
        body: COMMON_BODY,
      },
    },
  },
});

```
