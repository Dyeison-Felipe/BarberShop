import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { admin } from '../../../../shared/repositories/firebase/config.js';
import { FirebasePagination } from '../../../../shared/repositories/firebase/pagination.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { FavoriteList } from '../../entities/client-favorite-list.entity.js';
import {
  ClientFavoriteList,
  ClientFavoriteRepository,
} from '../client-favorite.repository.js';

export class ClientFavoriteFirebaseRepository
  implements ClientFavoriteRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}

  async findFavoriteInClientByIdAndBarberShopById({
    clientId,
    barberShopId,
  }: FavoriteClientAndBarberShop): Promise<FavoriteList | null> {
    const snapshot = await this.firebaseRepository
      .collection("Favorite")
      .where("clientId", "==", clientId)
      .where("barberShopId", "==", barberShopId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const favoriteFound = snapshot.docs[0];

    const favoriteProps = {
      id: favoriteFound.id,
      ...favoriteFound.data(),
    } as FavoriteListProps;
    console.log(
      "🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():",
      favoriteFound.data()
    );

    const barberShopEntity = new FavoriteList(favoriteProps);

    return barberShopEntity;
  }

  async getClientFavoriteList(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientFavoriteList>> {
    const query = this.firebaseRepository
      .collection('Favorite')
      .where('clientId', '==', clientId)
      .orderBy(admin.firestore.FieldPath.documentId());

    const { snapshot, meta } = await FirebasePagination.paginate(
      query,
      pagination,
    );

    const clientFavoriteList: ClientFavoriteList[] = await Promise.all(
      snapshot.docs.map(async (document) => {
        const barberShopSnapShot = await this.firebaseRepository
          .collection('Barber-Shop')
          .doc(document.data().barberShopId)
          .get();

        const clientFavoriteListData = barberShopSnapShot.data();

        if (!clientFavoriteListData) {
          throw new ResourceNotFoundError(
            'houve um erro ao encontrar a barbearia',
          );
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
      }),
    );

    return {
      data: clientFavoriteList,
      meta,
    };
  }

  async createClientFavorite(
    favoriteList: FavoriteList,
  ): Promise<FavoriteList | null> {
    try {
      const { id, ...favoriteListData } = favoriteList.toObject();
      await this.firebaseRepository
        .collection("Favorite")
        .doc(id)
        .set(favoriteListData);
      return favoriteList;
    } catch (error) {
      console.log(
        "🚀 ~ FavoriteListFirebaseRepository ~ createFavoriteList ~ error:",
        error
      );
      return null;
    }
  }

  async deleteClientFavoriteList(
    clientId: string,
    barberShopId: string
  ): Promise<boolean> {
    try {
      const snapshot = await this.firebaseRepository
        .collection("Favorite")
        .where("barberShopId", "==", barberShopId)
        .where("clientId", "==", clientId)
        .get();

      if (snapshot.empty) {
        return false;
      }

      const batch = this.firebaseRepository.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit(); 
      return true;
    } catch (error) {
      console.error("Erro ao deletar favorito:", error);
      return false;
    }
  }
}
