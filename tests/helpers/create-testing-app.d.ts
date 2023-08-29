import { FastifyInstance } from "fastify";

import { TABLES } from "#common/constants";

interface ICreateTestingAppOption {
  configs?: typeof TABLES;
  infra?: {
    authService: object;
  };
}

export declare function createTestingApp(option?: ICreateTestingAppOption): {
  app: FastifyInstance;
  teardown: () => Promise<void>;
};
