import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { Client } from "../../entities/client.entity.js";
import { ClientList, ClientRepository } from "../../repositories/client.repository.js";
import { ClientOutput, ClientService, CreateClientInput } from "../client.service.js";

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
}