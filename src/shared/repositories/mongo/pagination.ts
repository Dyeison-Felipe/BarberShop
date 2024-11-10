import { Document, Query } from 'mongoose';
import { Meta, PaginationInput } from '../pagination.repository.js';
import { BarberShopSchema } from '../../../core/barber-shop/schema/mongo/barber-shop.schema.js';
import { BarberShopProps } from '../../../core/barber-shop/entities/barber-shop.entity.js';

type Output<> = {
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
