import { ORDER_BY } from "#common/constants/index.js";

/**
 * A DTO representing metadata about a paginated collection of items.
 * @param {Object} options - An object containing the options for the DTO.
 * @param {Object} options.pageOptionsDto - An object containing the options for the current page.
 * @param {number} options.itemCount - The total number of items in the collection.
 * @returns {Object} - An object containing metadata about a paginated collection of items.
 */
const createPageMetaDto = ({ pageOptionsDto, itemCount }) => {
  const page = pageOptionsDto.page;
  const take = pageOptionsDto.take;
  const pageCount = Math.ceil(itemCount / take);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < pageCount;

  return { page, take, itemCount, pageCount, hasPreviousPage, hasNextPage };
};

/**
 * A DTO representing options for a paginated collection of items.
 * @param {Object} options - An object containing the options for the DTO.
 * @param {string} [options.order='ASC'] - The sort order of the items in the collection.
 * @param {number} [options.page=1] - The number of the current page.
 * @param {number} [options.take=10] - The maximum number of items per page.
 * @returns {Object} - An object containing options for a paginated collection of items.
 */
export const createPageOptionsDto = ({ order = ORDER_BY.asc, page = 1, take = 10 } = {}) => {
  const skip = (page - 1) * take;
  return { order, page, take, skip };
};

/**
 * A generic DTO representing a paginated collection of items.
 * @template T - The type of items in the collection.
 * @param {Array<T>} data - An array of items in the current page.
 * @param {Object} meta - The metadata for the paginated collection.
 * @returns {Object} - An object representing a paginated collection of items.
 */
const createPageDto = (data, meta) => ({ data, meta });

export const paginateQueryBuilder = async (queryBuilder, pageOptionsDto) => {
  const { skip, take } = pageOptionsDto;
  queryBuilder.skip(skip).take(take);

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = createPageMetaDto({ itemCount, pageOptionsDto });

  return createPageDto(entities, pageMetaDto);
};
