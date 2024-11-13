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
      throw new Error("erro ao adicionar aos favoritos");
    }

    const favoriteOutput: CreateFavoriteListOutput = {
      barberShopId: createFavorite.barberShopId,
      clientId: createFavorite.clientId,
    };

    return favoriteOutput;
  }

  async deleteClientFavorite(barberShopId: string): Promise<void> {
    try {
      const client = this.storageRequestService.get<ClientProps>(
        Constants.loggedUser
      );

      if (!client) {
        throw new Error("Client not found");
      }

      const favoriteDeleted =
        await this.clientFavoriteRepository.deleteClientFavoriteList(
          client.id,
          barberShopId
        );

      if (!favoriteDeleted) {
        throw new Error(
          `Favorite with id ${barberShopId} not found or could not be deleted`
        );
      }

    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }
  }
}
