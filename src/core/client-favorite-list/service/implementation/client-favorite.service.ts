import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { ClientFavoriteList, ClientFavoriteRepository } from "../../repositories/client-favorite.repository.js";
import { ClientFavoriteService } from "../client-favorite.service.js";

export class ClientFavoriteServiceImpl implements ClientFavoriteService {

  constructor(private readonly clientFavoriteRepository: ClientFavoriteRepository) {}

  async clientFavoriteList(
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>> {

    const barbersShopFavorite = await this.clientFavoriteRepository.clientFavoriteList(pagination);

    return barbersShopFavorite;
  }

}