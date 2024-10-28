import {
  PaginationInput,
  PaginationOutput,
} from "../../../shared/repositories/pagination.repository.js";
import { ClientFavoriteList } from "../repositories/client-favorite.repository.js";

export type CreateFavoriteInput = {
  barberShopId: string;
};

export type CreateFavoriteListOutput = {
  barberShopId: string;
  clientId: string;
}

export type FavoriteOutput = {
  id: string;
  barberShopId: string;
  clientId: string;
};

export interface ClientFavoriteService {
  getClientFavoriteList(
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>>;
  createClientFavorite(
    createFavoriteInput: CreateFavoriteInput
  ): Promise<CreateFavoriteListOutput>;
  deleteClientFavorite(id: string): Promise<void>;
}
