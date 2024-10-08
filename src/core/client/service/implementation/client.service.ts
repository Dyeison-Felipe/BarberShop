import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { Client } from "../../entities/client.entity.js";
import { ClientList, ClientRepository } from "../../repositories/client.repository.js";
import { ClientOutput, ClientService, CreateClientInput, UpdateClientInput, UpdateClientOutput } from "../client.service.js";

export class ClientServiceImpl implements ClientService {
  constructor(private readonly clientRepository : ClientRepository) {}

  async getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>> {
    const barbersShop = await this.clientRepository.getClient(
      pagination,
    );

    return barbersShop;
  }

  async createClient(
    createclientInput: CreateClientInput,
  ): Promise<ClientOutput> {
    const ClientEntity = Client.createClient(createclientInput);
    const createdClient = await this.clientRepository.createClient(
      ClientEntity,
    );

    if (!createdClient) {
      throw new Error('Erro ao criar usuário');
    }

    const ClientOutput: ClientOutput = {
      id: createdClient.id,
      name: createdClient.name,
      email: createdClient.email,
      password: createdClient.password,
      phoneNumber: createdClient.phoneNumber,
    };

    return ClientOutput;
  }


  // async updateClient(id: string, updateClientInput: UpdateClientInput): Promise<UpdateClientOutput> {
  //   // Busca o cliente existente pelo ID
  //   const existingClient = await this.clientRepository.findClientById(id);
    
  //   if (!existingClient) {
  //     throw new Error('Cliente não encontrado');
  //   }

  //   // Cria uma nova entidade Client preservando dados existentes e atualizando o necessário
  //   const updatedClientEntity = Client.updateClient(id, updateClientInput, existingClient);

  //   // Atualiza o cliente no repositório
  //   const updatedClient = await this.clientRepository.updateClient(id, updatedClientEntity.toObject());

  //   if (!updatedClient) {
  //     throw new Error('Erro ao atualizar o cliente');
  //   }

  //   // Prepara o objeto de saída para a atualização
  //   const updateClientOutput: UpdateClientOutput = {
  //     id: updatedClient.id,
  //     name: updatedClient.name,
  //     email: updatedClient.email,
  //     phoneNumber: updatedClient.phoneNumber,
  //     photoUrl: updatedClient.photoUrl,
  //   };

  //   return updateClientOutput;
  // }

}