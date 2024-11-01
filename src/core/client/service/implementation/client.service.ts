import e from 'express';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { Client } from '../../entities/client.entity.js';
import {
  ClientList,
  ClientRepository,
} from '../../repositories/client.repository.js';
import {
  ClientOutput,
  ClientService,
  CreateClientInput,
  UpdateClientInput,
  CreateClientOutput,
} from '../client.service.js';
import { ImageService } from '../../../../shared/services/image/image.service.js';
import { HashService } from '../../../../shared/hashService/hash-service.js';
import { StorageRequestService } from '../../../../shared/storage-request-service/storage-request-service.js';

export class ClientServiceImpl implements ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly imageService: ImageService,
    private readonly hashService: HashService,
    private readonly storageRequestService: StorageRequestService,
  ) {}

  async getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>> {
    const barbersShop = await this.clientRepository.getClient(pagination);

    console.log(this.storageRequestService.get('logged_user'));

    return barbersShop;
  }

  async getClientById(id: string): Promise<ClientOutput> {
    const client = await this.clientRepository.getClientById(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const { password, ...clientOutput } = client?.toObject();

    return clientOutput;
  }

  async createClient(
    createClientInput: CreateClientInput,
  ): Promise<CreateClientOutput> {
    const hashPassword = this.hashService.generateHash(
      createClientInput.password,
    );

    const findByEmail = await this.clientRepository.getClientByEmail(
      createClientInput.email,
    );

    if (findByEmail) {
      throw new Error(`O email ${createClientInput.email} já esta em uso`);
    }

    const ClientEntity = Client.createClient({
      ...createClientInput,
      password: hashPassword,
    });
    const createdClient = await this.clientRepository.createClient(
      ClientEntity,
    );

    if (!createdClient) {
      throw new Error('Erro ao criar usuário');
    }

    const createClientOutput: CreateClientOutput = {
      id: createdClient.id,
      name: createdClient.name,
      email: createdClient.email,
    };

    return createClientOutput;
  }

  async updateClient(
    updateClientInput: UpdateClientInput,
  ): Promise<ClientOutput> {
    const existingClient = await this.clientRepository.getClientById(
      updateClientInput.id,
    );
    console.log(
      '🚀 ~ ClientServiceImpl ~ updateClient ~ existingClient:',
      existingClient,
    );

    if (!existingClient) {
      throw new Error('Cliente não encontrado');
    }

    let photoUrl: string | undefined = undefined;

    if (updateClientInput.photo) {
      const url = existingClient.photoUrl;
      console.log('🚀 ~ BarberShopServiceImpl ~ url:', url);

      const currentFileName = this.imageService.getImageNameByUrl(url);

      photoUrl = await this.imageService.uploadImage(
        updateClientInput.photo,
        currentFileName,
        'client',
      );
    }

    existingClient.updateClient({ ...updateClientInput, photoUrl });
    const updatedClient = await this.clientRepository.updateClient(
      existingClient,
    );

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

  deleteClient(id: string): Promise<void> {
    const client = this.clientRepository.deleteClient(id);

    if (!client) {
      throw new Error('Client não encontrado');
    }

    return client;
  }
}
