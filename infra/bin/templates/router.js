export function generateRouterCode({ UpperCaseNameSingle, LowerCaseName, ModuleName, isAuthorization }) {
  return `
import { STATUS_SUCCESS } from "#constants";
import { ResourceNotFoundException } from "#errors";
import { createPageOptionsDto, paginateQueryBuilder } from "#utils/common/index.js";
import ${LowerCaseName}Schemas from "#modules/${ModuleName}/${ModuleName}.schemas.js";

/** @type {import('@fastify/type-provider-typebox').FastifyPluginAsyncTypebox } */
export default async function ${LowerCaseName}RouterV1(app) {
  const { ${LowerCaseName}Repository } = app.diContainer.cradle;


  ${isAuthorization ? 'app.addHook("preValidation", app.auth([app.verifyJwt]));' : ""}

  app.post("/", {
    schema: ${LowerCaseName}Schemas.create,

    async handler({ body: dto }) {
      const new${UpperCaseNameSingle} = ${LowerCaseName}Repository.create(dto);

      const ${LowerCaseName} = await ${LowerCaseName}Repository.save(new${UpperCaseNameSingle});

      return ${LowerCaseName};
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

      const ${LowerCaseName} = await ${LowerCaseName}Repository.findOneBy({ id });

      if (!${LowerCaseName}) {
        throw new ResourceNotFoundException(${"`"}${UpperCaseNameSingle} with id: ${"${id}"} not found${"`"});
      }

      return ${LowerCaseName};
    },
  });

  app.put("/:id", {
    schema: ${LowerCaseName}Schemas.update,

    async handler({ body: dto, params: { id } }) {
      let ${LowerCaseName} = await ${LowerCaseName}Repository.findOneBy({ id });

      if (!${LowerCaseName}) {
        throw new ResourceNotFoundException(${"`"}${UpperCaseNameSingle} with id: ${"${id}"} not found${"`"});
      }

      ${LowerCaseName} = ${LowerCaseName}Repository.merge(${LowerCaseName}, dto);

      ${LowerCaseName} = await ${LowerCaseName}Repository.save(${LowerCaseName});

      return ${LowerCaseName};
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
