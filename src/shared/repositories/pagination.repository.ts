export type PaginationInput = {
  page: number;
  limit: number;
};

export type Meta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationOutput<Entity> = {
  data: Entity[];
  meta: Meta;
};
