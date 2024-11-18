import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { MongoPagination } from '../../../../shared/repositories/mongo/pagination.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { BarberShopSchema } from '../../../barber-shop/schema/mongo/barber-shop.schema.js';
import { FavoriteList } from '../../entities/client-favorite-list.entity.js';
import { ClientFavoriteListSchema } from '../../schema/mongo/client-favorite-list.schema.js';
import {
  ClientFavoriteList,
  ClientFavoriteRepository,
} from '../client-favorite.repository.js';

export class ClientFavoriteMongoRepository implements ClientFavoriteRepository {
  async getClientFavoriteList(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientFavoriteList>> {
    const query = ClientFavoriteListSchema.find({ clientId });

    const { documents, meta } = await MongoPagination.paginate(
      query,
      pagination,
    );

    const clientFavoriteList: ClientFavoriteList[] = await Promise.all(
      documents.map(async (document) => {
        const barberShopSnapShot = await BarberShopSchema.findById(document.id);

        if (!barberShopSnapShot) {
          throw new ResourceNotFoundError(
            'houve um erro ao encontrar a barbearia',
          );
        }

        return {
          barberShop: {
            id: barberShopSnapShot.id,
            name: barberShopSnapShot.name!,
            rating: barberShopSnapShot.rating!,
            photoUrl: barberShopSnapShot.photoUrl!,
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
      const { id, ...json } = favoriteList.toObject();
      const clientFavoriteListSchema = new ClientFavoriteListSchema({
        _id: id,
        ...json,
      });
      await clientFavoriteListSchema.save();
      return favoriteList;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteClientFavoriteList(id: string): Promise<boolean> {
    try {
      const result = await ClientFavoriteListSchema.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
