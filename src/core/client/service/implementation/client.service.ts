import e from "express";
import {
  PaginationInput,
  PaginationOutput,
} from "../../../../shared/repositories/pagination.repository.js";
import { Client } from "../../entities/client.entity.js";
import {
  ClientList,
  ClientRepository,
} from "../../repositories/client.repository.js";
import {
  UpdateClientOutput,
  ClientService,
  CreateClientInput,
  UpdateClientInput,
  CreateClientOutput,
} from "../client.service.js";
import { ImageService } from "../../../../shared/services/image/image.service.js";
import { HashService } from "../../../../shared/hashService/hash-service.js";

export class ClientServiceImpl implements ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly imageService: ImageService,
    private readonly hashService: HashService
  ) {}

  async getClient(
    pagination: PaginationInput
  ): Promise<PaginationOutput<ClientList>> {
    const barbersShop = await this.clientRepository.getClient(pagination);

    return barbersShop;
  }

  async getClientById(id: string): Promise<UpdateClientOutput> {
    const client = await this.clientRepository.getClientById(id);

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    return client;
  }

  async createClient(
    createClientInput: CreateClientInput
  ): Promise<CreateClientOutput> {

    const hashPassword = this.hashService.generateHash(createClientInput.password);

    const ClientEntity = Client.createClient({
      ...createClientInput, 
      password: hashPassword,
    });
    const createdClient = await this.clientRepository.createClient(
      ClientEntity
    );

    if (!createdClient) {
      throw new Error("Erro ao criar usuário");
    }

    const createClientOutput: CreateClientOutput = {
      id: createdClient.id,
      name: createdClient.name,
      email: createdClient.email,
    };

    return createClientOutput;
  }

  async updateClient(
    updateClientInput: UpdateClientInput
  ): Promise<UpdateClientOutput> {
    const existingClient = await this.clientRepository.getClientById(
      updateClientInput.id
    );
    console.log(
      "🚀 ~ ClientServiceImpl ~ updateClient ~ existingClient:",
      existingClient
    );

    if (!existingClient) {
      throw new Error("Cliente não encontrado");
    }

    let photoUrl: string | undefined = undefined;

    if (updateClientInput.photo) {
      const url = existingClient.photoUrl;
      console.log("🚀 ~ BarberShopServiceImpl ~ url:", url);

      const currentFileName = this.imageService.getImageNameByUrl(url);

      photoUrl = await this.imageService.uploadImage(
        updateClientInput.photo,
        currentFileName,
        "client"
      );
    }

    existingClient.updateClient({ ...updateClientInput, photoUrl });
    const updatedClient = await this.clientRepository.updateClient(
      existingClient
    );

    if (!updatedClient) {
      throw new Error("Erro ao atualizar cliente");
    }

    const updateClientOutput: UpdateClientOutput = {
      id: updatedClient.id,
      name: updatedClient.name,
      email: updatedClient.email,
      phoneNumber: updatedClient.phoneNumber,
      photoUrl: updatedClient.photoUrl,
    };

    return updateClientOutput;
  }

  deleteClient(id: string): Promise<void> {
    const client = this.clientRepository.deleteClient(id);

    if (!client) {
      throw new Error("Client não encontrado");
    }

    return client;
  }
}
