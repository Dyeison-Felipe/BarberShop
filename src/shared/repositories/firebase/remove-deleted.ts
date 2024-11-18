import { admin } from './config.js';

export class FirebaseRemoveDeleted {
  static remove(
    query: admin.firestore.Query<
      admin.firestore.DocumentData,
      admin.firestore.DocumentData
    >,
  ) {
    return query.orderBy('isDeleted').where('isDeleted', '!=', true);
  }
}
