import { FastifyRequest } from "fastify";
import { RouteGenericInterface, RouteHandlerMethod } from "fastify/types/route";

import { FastifySchema } from "fastify/types/schema";
import {
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  ResolveFastifyReplyReturnType,
} from "fastify/types/type-provider";
import {
  ContextConfigDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from "fastify/types/utils";
import { FastifyBaseLogger } from "fastify/types/logger";

export declare function useCase<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
  fn: (
    data: FastifyRequest<
      RouteGeneric,
      RawServer,
      RawRequest,
      SchemaCompiler,
      TypeProvider,
      ContextConfig,
      Logger
    >["body"] &
      FastifyRequest<
        RouteGeneric,
        RawServer,
        RawRequest,
        SchemaCompiler,
        TypeProvider,
        ContextConfig,
        Logger
      >["params"] &
      FastifyRequest<
        RouteGeneric,
        RawServer,
        RawRequest,
        SchemaCompiler,
        TypeProvider,
        ContextConfig,
        Logger
      >["query"],
  ) => ResolveFastifyReplyReturnType<TypeProvider, SchemaCompiler, RouteGeneric>,
): RouteHandlerMethod<
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ContextConfig,
  SchemaCompiler,
  TypeProvider,
  Logger
>;
