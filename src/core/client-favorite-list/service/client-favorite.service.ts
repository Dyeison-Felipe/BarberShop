import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository.js";
import { ClientFavoriteList } from "../repositories/client-favorite.repository.js";

export interface ClientFavoriteService {
  clientFavoriteList(pagination: PaginationInput):Promise<PaginationOutput<ClientFavoriteList>>;
}