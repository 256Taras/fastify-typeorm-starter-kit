import { camelToHyphenCase } from "../utils/camel-to-hyphen-case.js";

export function generateRouterCode({
  UpperCaseNameSingle,
  LowerCaseNameSingle,
  LowerCaseName,
  ModuleName,
  isAuthorization,
}) {
  return `
import { createPageOptionsDto, paginateQueryBuilder } from "#common/utils/common/index.js";
import { ResourceNotFoundException } from "#common/errors/index.js";
import { STATUS_SUCCESS } from "#common/constants/index.js";
import ${LowerCaseName}Schemas from "#modules/${camelToHyphenCase(ModuleName)}/${camelToHyphenCase(
    ModuleName,
  )}.schemas.js";

/** @type {import('@fastify/type-provider-typebox').FastifyPluginAsyncTypebox } */
export default async function ${LowerCaseName}RouterV1(app) {
  const { ${LowerCaseName}Repository } = app.diContainer.cradle;


  ${isAuthorization ? 'app.addHook("preValidation", app.auth([app.verifyJwt]));' : ""}

  app.post("/", {
    schema: ${LowerCaseName}Schemas.create,

    async handler({ body: dto }) {
      const new${UpperCaseNameSingle} = ${LowerCaseName}Repository.create(dto);

      const ${LowerCaseNameSingle} = await ${LowerCaseName}Repository.save(new${UpperCaseNameSingle});

      return ${LowerCaseNameSingle};
    },
  });

  app.get("/", {
    schema: ${LowerCaseName}Schemas.get,

    async handler({ query: dto }){
      const pageOptionsDto = createPageOptionsDto(dto);

      const queryBuilder = ${LowerCaseName}Repository
        .createQueryBuilder("${LowerCaseName}")
        .orderBy("${LowerCaseName}.createdAt", pageOptionsDto.order);

      return paginateQueryBuilder(queryBuilder, pageOptionsDto);
    },
  });

  app.get("/:id", {
    schema: ${LowerCaseName}Schemas.getOne,

    async handler({ params: { id } }) {

      const ${LowerCaseNameSingle} = await ${LowerCaseName}Repository.findOneBy({ id });

      if (!${LowerCaseNameSingle}) {
        throw new ResourceNotFoundException(${"`"}${UpperCaseNameSingle} with id: ${"${id}"} not found${"`"});
      }

      return ${LowerCaseNameSingle};
    },
  });

  app.put("/:id", {
    schema: ${LowerCaseName}Schemas.update,

    async handler({ body: dto, params: { id } }) {
      let ${LowerCaseNameSingle} = await ${LowerCaseName}Repository.findOneBy({ id });

      if (!${LowerCaseNameSingle}) {
        throw new ResourceNotFoundException(${"`"}${UpperCaseNameSingle} with id: ${"${id}"} not found${"`"});
      }

      ${LowerCaseNameSingle} = ${LowerCaseName}Repository.merge(${LowerCaseNameSingle}, dto);

      ${LowerCaseNameSingle} = await ${LowerCaseName}Repository.save(${LowerCaseNameSingle});

      return ${LowerCaseNameSingle};
    },
  });

  app.delete("/:id", {
    schema: ${LowerCaseName}Schemas.delete,

    async handler({ params: { id } }) {
      const deleteResult = await ${LowerCaseName}Repository.delete(id);

      if (deleteResult.affected === 0) {
        throw new ResourceNotFoundException(${"`"}${UpperCaseNameSingle} with id: ${"${id}"} not found${"`"});
      }

      return STATUS_SUCCESS;
    },
  });
}
`;
}
