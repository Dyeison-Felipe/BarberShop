import { Meta, PaginationInput } from '../pagination.repository.js';

type Output = {
  documents: any[];
  meta: Meta;
};

export class MongoPagination {
  static async paginate(
    query: any,
    { limit, page }: PaginationInput,
  ): Promise<Output> {
    const skip = (page - 1) * limit;

    const countQuery = query.clone();

    const [documents, totalItems] = await Promise.all([
      query.skip(skip).limit(limit),
      countQuery.countDocuments(),
    ]);

    return {
      documents,
      meta: {
        currentPage: page,
        itemCount: documents.length,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
