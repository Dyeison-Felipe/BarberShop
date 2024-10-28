import {
  PaginationInput,
  PaginationOutput,
} from "../../../shared/repositories/pagination.repository.js";
import { BarberShopList } from "../../barber-shop/repositories/barber-shop.repository.js";
import { FavoriteList } from "../entities/client-favorite-list.entity.js";

export type ClientFavoriteList = {
  barberShop: BarberShopList;
  clientId: string;
};

export type PaginationInputFavorite = {
  clientId: string;
  limit: number;
  offset: number;
};

export interface ClientFavoriteRepository {
  getClientFavoriteList(
    clientId: string,
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>>;
  createClientFavorite(favoriteList: FavoriteList): Promise<FavoriteList | null>;
  deleteClientFavoriteList(id: string): Promise<void>;
}
