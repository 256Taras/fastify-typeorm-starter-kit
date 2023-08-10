`APPLICATION_NAME` - Name of the application.

`APPLICATION_URL` - URL address of the application.

`ENV_NAME` - Name of the environment in which the application is running.

`NODE_ENV` - Name of the current environment (e.g. "production", "development", "test", etc.).

`APPLICATION_DOMAIN` - Domain name of the application.

`LOG_LEVEL` - Logger configuration. Possible options are: "trace", "debug", "info", "warn", "error", "fatal".

`ENABLE_PRETTY_LOG` - Enables pretty printing of logs. This is intended for non-production configurations. Possible options are: 0 or 1.

`ENABLE_COLORIZED_LOG` - Logs in the console with or without colors. Possible options are: 0 or 1.

`ENABLE_DB_LOGGING` - Enables logging of database queries. Possible options are: 0 or 1.

`ENABLE_SEEDS` - Enables seed data. Possible options are: 0 or 1.

`ENABLE_REQUEST_LOGGING` - Enables logging of incoming requests. Possible options are: 0 or 1.

`ENABLE_DEBUG` - Enables debugging mode. Possible options are: 0 or 1.

`ENABLE_RESPONSE_LOGGING_BODY` - Enables logging of response bodies. Possible options are: 0 or 1.

`ENABLE_DEVELOPER_MESSAGE` - Enables messages for developers only. These can be seen in error messages. Possible options are: 0 or 1.

`ENABLE_PERSISTENCE_FORCE_LOGGING` - Enables force logging of persistence. Possible options are: 0 or 1.

`HTTP_PORT` - The port on which the server will start.

`VERSION` - The current version of the application.

`SHUTDOWN_TIMEOUT` - The time (in milliseconds) to wait for the server to shutdown gracefully.

`IP` - IP address that the server will listen on. Possible options are: "localhost", "127.0.0.1", or "0.0.0.0".

`RATE_LIMIT_MAX` - Maximum number of calls you want to allow in a particular time interval. Setting rate limits enables you to manage the network traffic for your APIs and for specific operations within your APIs.

`RATE_LIMIT_TIME_WINDOW` - The time interval (in milliseconds) for rate limiting.

`COMPOSE_PROJECT_NAME` - The name of the process in Docker.

`API_KEY` - Hardcoded double-step verification based on ENV_NAME in configs to prevent accidental migration running on production DB.

`TYPEORM_NAME` - Name of the database.

`TYPEORM_TYPE` - Type of database.

`TYPEORM_HOST` - Hostname of the database.

`TYPEORM_PORT` - Port number of the database.

`TYPEORM_DATABASE` - Name of the database.

`TYPEORM_USERNAME` - Username for the database.

`TYPEORM_PASSWORD` - Password for the database.

`TYPEORM_SSL` - Whether SSL is enabled. Possible options are: true or false.

`TYPEORM_CACHE` - Whether caching is enabled. Possible options are: true or false.

`TYPEORM_LOGGING` -  is a configuration parameter for the TypeORM library, which specifies the level of logging that should be enabled for database queries and schema synchronization.

`AWS_CLIENT_ID` - AWS client ID

`AWS_CLIENT_SECRETE` - AWS client secret

`AWS_REGION` - AWS region

`AWS_CLOUDWATCH_REGION` - AWS CloudWatch region

`AWS_CLOUDWATCH_ACCESS_KEY_ID` - AWS CloudWatch access key ID

`AWS_CLOUDWATCH_SECRET_ACCESS_KEY` - AWS CloudWatch secret access key

`AWS_SDK_LOAD_CONFIG` - AWS SDK load config

`COOKIE_SECRET` - Secret key used for encrypting cookies

`JWT_REFRESH_TOKEN_EXPIRATION_TIME` - Expiration time for JWT refresh token

`JWT_REFRESH_TOKEN_SECRET` - Secret key used for JWT refresh token encryption

`JWT_ACCESS_TOKEN_EXPIRATION_TIME` - Expiration time for JWT access token

`JWT_ACCESS_TOKEN_SECRET` - Secret key used for JWT access token encryption

`ENABLE_CRON` - Enables/disables the cron job feature. Possible options are 0 or 1