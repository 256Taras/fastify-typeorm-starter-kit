export function generateTypesCode({ UpperCaseNameSingle, ModuleName, ModuleNameSingle, LowerCaseName }) {
  return `
import { Repository } from "typeorm";

import type ${UpperCaseNameSingle} from "#modules/${ModuleName}/${ModuleNameSingle}.entity.js";

declare module "@fastify/awilix" {
  interface Cradle {
    ${LowerCaseName}Repository: Repository<${UpperCaseNameSingle}>;
  }
}
`;
}
