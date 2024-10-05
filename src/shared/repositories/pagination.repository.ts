export type PaginationInput = {
  page: number;
  limit: number;
}

export type PaginationOutput<Entity> = {
  data: Entity[];
  meta: {
    itemCount: number,
    totalItems: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  }
}