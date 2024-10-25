import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository.js";

export type ClientFavoriteList = {
  barberShopId: string;
  clientId: string;
};

export type PaginationInputFavorite = {
  clientId: string;
  limit: number;
  offset: number;
};

export type PaginationOutputFavorite<T> = {
  items: T[]; // Adiciona a propriedade items que será um array do tipo T
  total: number;
};


export interface ClientFavoriteRepository {
  clientFavoriteList(pagination: PaginationInput):Promise<PaginationOutput<ClientFavoriteList>>;
}