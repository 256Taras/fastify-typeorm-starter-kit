/**
 * @typedef {Object} HttpErrorResponseType
 * @property {number} code
 * @property {number} httpStatusCode
 * @property {string} userMessage
 * @property {string} developerMessage
 */

/**
 * @typedef {Object} DbCustomExtensionMethod
 * @property {any} close close all connections
 */

/**
 * @typedef {import("knex").Knex} KnexClientType
 */

/**
 * @typedef {import("knex").Knex.QueryBuilder} KnexQueryBuilderType
 */

/**
 * @typedef {{knex: KnexClientType} & DbCustomExtensionMethod & {queryRunner: import("../common/infra/db/knex").queryRunner} & {init: Function}} KnexDbType
 */

/**
 * @typedef {Object.<string, HttpErrorResponseType>} HttpErrorCollection
 */

/**
 * @typedef {Object.<string, import("fastify").RouteHandler>} ControllerType
 */

/**
 * @typedef {Object.<string,  HttpErrorCollection>} ModuleErrorType
 */

/**
 * @typedef {import("knex").Knex.Raw} KnexRaw
 */

// export is required to enable importing of JSDoc typedef
export default {};
