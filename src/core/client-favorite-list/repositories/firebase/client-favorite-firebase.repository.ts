import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { ClientFavoriteList, ClientFavoriteRepository, PaginationInputFavorite, PaginationOutputFavorite } from "../client-favorite.repository.js";

export class ClientFavoriteFirebaseRepository implements ClientFavoriteRepository {
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}
  clientFavoriteList(pagination: PaginationInput): Promise<PaginationOutput<ClientFavoriteList>> {
    throw new Error("Method not implemented.");
  }
  
}
