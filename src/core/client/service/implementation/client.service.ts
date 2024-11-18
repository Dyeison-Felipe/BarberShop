import e from 'express';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { Client, ClientProps } from '../../entities/client.entity.js';
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
import { HashService } from '../../../../shared/hash-service/hash-service.js';
import { StorageRequestService } from '../../../../shared/storage-request-service/storage-request-service.js';
import { Constants } from '../../../../shared/utils/constants.js';
import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { ResourceAlreadyInUseError } from '../../../../shared/errors/resource-already-in-use-error.js';
import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';

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

    return barbersShop;
  }

  async getClientById(): Promise<ClientOutput> {
    const loggedClient = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    const client = await this.clientRepository.getClientById(loggedClient!.id);

    if (!client) {
      throw new ResourceNotFoundError('Cliente não encontrado');
    }

    const { password, ...clientOutput } = client?.toJSON();

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
      throw new ResourceAlreadyInUseError(
        `O email ${createClientInput.email} já esta em uso`,
      );
    }

    const ClientEntity = Client.createClient({
      ...createClientInput,
      password: hashPassword,
    });
    const createdClient = await this.clientRepository.createClient(
      ClientEntity,
    );

    if (!createdClient) {
      throw new InternalServerError('Erro ao criar usuário');
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
    const client = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    if (!client?.id) {
      throw new ResourceNotFoundError('Cliente não encontrado');
    }

    const existingClient = await this.clientRepository.getClientById(
      client?.id,
    );

    if (!existingClient) {
      throw new ResourceNotFoundError('Cliente não encontrado');
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
      throw new InternalServerError('Erro ao atualizar cliente');
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

  async deleteClient(): Promise<void> {
    const loggedClient = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    if (!loggedClient?.id) {
      throw new ResourceNotFoundError('Cliente não encontrado');
    }

    const foundClient = await this.clientRepository.getClientById(
      loggedClient?.id,
    );

    if (!foundClient) {
      throw new ResourceNotFoundError('Cliente não encontrado');
    }

    const client = await this.clientRepository.deleteClient(loggedClient.id);

    if (!client) {
      throw new InternalServerError('Falha ao deletar cliente');
    }
  }
}
