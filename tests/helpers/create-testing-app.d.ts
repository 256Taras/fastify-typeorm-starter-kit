import { FastifyInstance } from "fastify";

import { tables } from "#constants";

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
