import {
  PaginationInput,
  PaginationOutput,
} from "../../../../shared/repositories/pagination.repository.js";
import { FavoriteList } from "../../entities/client-favorite-list.entity.js";
import {
  ClientFavoriteList,
  ClientFavoriteRepository,
} from "../../repositories/client-favorite.repository.js";
import { ClientFavoriteService, CreateFavoriteInput, CreateFavoriteListOutput, FavoriteOutput } from "../client-favorite.service.js";

export class ClientFavoriteServiceImpl implements ClientFavoriteService {
  constructor(
    private readonly clientFavoriteRepository: ClientFavoriteRepository
  ) {}
  
  async getClientFavoriteList(
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientFavoriteList>> {

    //TODO pegar id do token
    const clientId = '38332610-fa4d-4382-addd-38fbc6ea9be5'
    const barbersShopFavorite =
    await this.clientFavoriteRepository.getClientFavoriteList(clientId,pagination);
    
    return barbersShopFavorite;
  }


  async createClientFavorite(createFavoriteInput: CreateFavoriteInput): Promise<CreateFavoriteListOutput> {
    const favoriteEntity = FavoriteList.createClientFavorite({
      ...createFavoriteInput,
          //TODO pegar id do token
      clientId: '8024a5cc-144a-4709-9a89-6bf32905febf',
    })
    
    const createFavorite = await this.clientFavoriteRepository.createClientFavorite(favoriteEntity);
    
    if(!createFavorite) {
      throw new Error ('erro ao adicionar aos favoritos')
    }
    
    const favoriteOutput: CreateFavoriteListOutput = {
      barberShopId: createFavorite.barberShopId,
      clientId: createFavorite.clientId
    }
    
    return favoriteOutput;
  }


  async deleteClientFavorite(id: string): Promise<void> {
    const favorite = this.clientFavoriteRepository.deleteClientFavoriteList(id);
    if (!favorite) {
      throw new Error(`favorite id ${id} NotFound`);
    }
  }
}
