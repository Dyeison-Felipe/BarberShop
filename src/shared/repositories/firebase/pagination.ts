import {
  Meta,
  PaginationInput,
  PaginationOutput,
} from '../pagination.repository.js';
import { admin } from './config.js';

type DocumentData = admin.firestore.DocumentData;

type Output = {
  snapshot: admin.firestore.QuerySnapshot<DocumentData, DocumentData>;
  meta: Meta;
};

export class FirebasePagination {
  static async paginate(
    query: admin.firestore.Query<DocumentData, DocumentData>,
    { limit, page }: PaginationInput,
  ): Promise<Output> {
    const offset = (page - 1) * limit;

    const [snapshot, countSnapshot] = await Promise.all([
      query.limit(limit).offset(offset).get(),
      query.count().get(),
    ]);

    const totalItems = countSnapshot.data().count;

    return {
      snapshot: snapshot,
      meta: {
        currentPage: page,
        itemCount: snapshot.size,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
