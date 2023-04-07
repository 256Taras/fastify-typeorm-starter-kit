import { LIMIT, ORDER_BY } from "#constants";

export const pagination = (request) => {
  const page = +request.query.page || 1;
  const limit = +request.query.limit || LIMIT;
  const order = +request.query.order || ORDER_BY.asc;

  return {
    order,
    page,
    limit,
    offset: (page - 1) * limit,
  };
};
