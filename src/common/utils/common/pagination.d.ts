import { QueryBuilder } from "typeorm";

/**
 * A DTO representing metadata about a paginated collection of items.
 */
interface PageMetaDto {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
/**
 * A DTO representing options for a paginated collection of items.
 */
interface PageOptionsDto {
  order: string;
  page: number;
  take: number;
  skip: number;
}
/**
 * A generic DTO representing a paginated collection of items.
 * @template T - The type of items in the collection.
 */
interface PageDto<T> {
  data: T[];
  meta: PageMetaDto;
}

export declare const createPageOptionsDto: ({
  order,
  page,
  take,
}?: {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}) => {
  order: "ASC" | "DESC";
  page: number;
  take: number;
  skip: number;
};

export declare const paginateQueryBuilder: <T>(
  queryBuilder: QueryBuilder<any>,
  pageOptionsDto: PageOptionsDto,
) => Promise<PageDto<T>>;
export {};
