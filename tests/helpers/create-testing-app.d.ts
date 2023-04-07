import { tables } from "#constants";
import { FastifyInstance } from "fastify";

interface ICreateTestingAppOption {
  configs?: typeof tables;
  infra?: {
    authService: object;
  };
}

export declare function createTestingApp(option?: ICreateTestingAppOption): {
  app: FastifyInstance;
  teardown: () => Promise<void>;
};
