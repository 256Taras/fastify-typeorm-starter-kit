/**
 * @typedef {Object} HttpErrorResponseType
 * @property {number} code
 * @property {number} statusCode
 * @property {string} userMessage
 * @property {string} developerMessage
 */

/**
 * @typedef {Object} DbCustomExtensionMethod
 * @property {any} close close all connections
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

// export is required to enable importing of JSDoc typedef
export default {};
