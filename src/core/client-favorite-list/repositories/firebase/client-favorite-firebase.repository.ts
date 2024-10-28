import { admin } from "../../../../shared/repositories/firebase/config.js";
import { FirebasePagination } from "../../../../shared/repositories/firebase/pagination.js";
import {
  PaginationInput,
  PaginationOutput,
} from "../../../../shared/repositories/pagination.repository.js";
import { FavoriteList } from "../../entities/client-favorite-list.entity.js";
import {
  ClientFavoriteList,
  ClientFavoriteRepository,
} from "../client-favorite.repository.js";

export class ClientFavoriteFirebaseRepository
  implements ClientFavoriteRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore
  ) {}

  async getClientFavoriteList(
    clientId: string,
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>> {
    const query = this.firebaseRepository
      .collection("Favorite")
      .where("clientId", "==", clientId)
      .orderBy(admin.firestore.FieldPath.documentId());

    const { snapshot, meta } = await FirebasePagination.paginate(
      query,
      pagination
    );

    const clientFavoriteList: ClientFavoriteList[] = await Promise.all(
      snapshot.docs.map(async (document) => {
        const barberShopSnapShot = await this.firebaseRepository
          .collection("Barber-Shop")
          .doc(document.data().barberShopId)
          .get();

        const clientFavoriteListData = barberShopSnapShot.data();

        if (!clientFavoriteListData) {
          throw new Error("houve um erro ao encontrar a barbearia");
        }

        return {
          barberShop: {
            id: barberShopSnapShot.id,
            name: clientFavoriteListData.name,
            rating: clientFavoriteListData.rating,
            photoUrl: clientFavoriteListData.photoUrl,
          },
          clientId: document.id,
        };
      })
    );

    return {
      data: clientFavoriteList,
      meta,
    };
  }

  async createClientFavorite(
    favoriteList: FavoriteList
  ): Promise<FavoriteList | null> {
    try {
      const { id, ...favoriteListData } = favoriteList.toObject();
      await this.firebaseRepository
        .collection('Favorite')
        .doc(id)
        .set(favoriteListData);
      return favoriteList;
    } catch (error) {
      console.log(
        '🚀 ~ FavoriteListFirebaseRepository ~ createFavoriteList ~ error:',
        error,
      );
      return null;
    }
  }

  async deleteClientFavoriteList(id: string): Promise<void> {
    try {
      const snapshot = await this.firebaseRepository
        .collection("Favorite")
        .doc(id)
        .get();

      if (!snapshot.exists) {
        return;
      }

      await this.firebaseRepository.collection("Favorite").doc(id).delete();
    } catch (error) {
      return;
    }
  }
}
