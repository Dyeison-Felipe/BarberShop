import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';
import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import {
  PaginationInput,
  PaginationOutput,
} from "../../../../shared/repositories/pagination.repository.js";
import { StorageRequestService } from "../../../../shared/storage-request-service/storage-request-service.js";
import { Constants } from "../../../../shared/utils/constants.js";
import { ClientProps } from "../../../client/entities/client.entity.js";
import { FavoriteList } from "../../entities/client-favorite-list.entity.js";
import {
  ClientFavoriteList,
  ClientFavoriteRepository,
} from "../../repositories/client-favorite.repository.js";
import {
  ClientFavoriteService,
  CreateFavoriteInput,
  CreateFavoriteListOutput,
} from "../client-favorite.service.js";

export class ClientFavoriteServiceImpl implements ClientFavoriteService {
  constructor(
    private readonly clientFavoriteRepository: ClientFavoriteRepository,
    private readonly storageRequestService: StorageRequestService
  ) {}

  async getClientFavoriteList(
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>> {
    const client = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser
    );
    const barbersShopFavorite =
      await this.clientFavoriteRepository.getClientFavoriteList(
        client!.id,
        pagination
      );

    return barbersShopFavorite;
  }

  async createClientFavorite(
    createFavoriteInput: CreateFavoriteInput
  ): Promise<CreateFavoriteListOutput> {
    const client = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser
    );

    const existFavorite =
      await this.clientFavoriteRepository.findFavoriteInClientByIdAndBarberShopById(
        {
          clientId: client!.id,
          ...createFavoriteInput,
        }
      );

    if (existFavorite) {
      throw new Error("Barbearia já adicionada");
    }

    const favoriteEntity = FavoriteList.createClientFavorite({
      ...createFavoriteInput,
      clientId: client!.id,
    });

    const createFavorite =
      await this.clientFavoriteRepository.createClientFavorite(favoriteEntity);

    if (!createFavorite) {
      throw new InternalServerError('erro ao adicionar aos favoritos');
    }

    const favoriteOutput: CreateFavoriteListOutput = {
      barberShopId: createFavorite.barberShopId,
      clientId: createFavorite.clientId,
    };

    return favoriteOutput;
  }

  async deleteClientFavorite(
    barberShopId: string): Promise<void> {
      const client = this.storageRequestService.get<ClientProps>(
        Constants.loggedUser
      );
      const favorite = await this.clientFavoriteRepository.findFavoriteInClientByIdAndBarberShopById({clientId: client!.id,barberShopId})
      if (!favorite) {
        throw new ResourceNotFoundError(`favorite id NotFound`);
      }

      const deleteFavorite = this.clientFavoriteRepository.deleteClientFavoriteList(client!.id,barberShopId);
    }
}
