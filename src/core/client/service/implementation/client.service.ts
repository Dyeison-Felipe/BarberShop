import e from "express";
import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { Client } from "../../entities/client.entity.js";
import { ClientList, ClientRepository } from "../../repositories/client.repository.js";
import { ClientOutput, ClientService, CreateClientInput, UpdateClientInput } from "../client.service.js";

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

  async getClientById(id: string): Promise<ClientOutput> {
    const client = await this.clientRepository.getClientById(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return client;
  }

  // async createClient(
  //   createclientInput: CreateClientInput,
  // ): Promise<ClientOutput> {
  //   const ClientEntity = Client.createClient(createclientInput);
  //   const createdClient = await this.clientRepository.createClient(
  //     ClientEntity,
  //   );

  //   if (!createdClient) {
  //     throw new Error('Erro ao criar usuário');
  //   }

  //   const clientOutput: ClientOutput = {
  //     id: createdClient.id,
  //     name: createdClient.name,
  //     email: createdClient.email,
  //     phoneNumber: createdClient.phoneNumber,
  //     photoUrl: createdClient.photoUrl,
  //   };

  //   return clientOutput;
  // }


  async updateClient(updateClientInput: UpdateClientInput): Promise<ClientOutput> {
    const existingClient = await this.clientRepository.getClientById(updateClientInput.id);
    console.log("🚀 ~ ClientServiceImpl ~ updateClient ~ existingClient:", existingClient)
    
    if (!existingClient) {
      throw new Error('Cliente não encontrado');
    }

    existingClient.updateClient(updateClientInput)
    const updatedClient = await this.clientRepository.updateClient(existingClient);
    
    if (!updatedClient) {
      throw new Error('Erro ao atualizar cliente');
    }

    const updateClientOutput: ClientOutput = {
      id: updatedClient.id,
      name: updatedClient.name,
      email: updatedClient.email,
      phoneNumber: updatedClient.phoneNumber,
      photoUrl: updatedClient.photoUrl,
    };
    
    return updateClientOutput;
  }

}