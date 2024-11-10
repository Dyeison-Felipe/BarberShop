import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Image } from '../../../shared/services/image/image.service.js';
import { ClientList } from '../repositories/client.repository.js';

export type ClientInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateClientInput = ClientInput;

export type UpdateClientInput = {
  name?: string;
  phoneNumber?: string;
  photo?: Image | null;
};

export type CreateClientOutput = {
  id: string;
  name: string;
  email: string;
};

export type ClientOutput = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
};

export interface ClientService {
  getClient(pagination: PaginationInput): Promise<PaginationOutput<ClientList>>;
  getClientById(): Promise<ClientOutput>;
  createClient(
    createClientInput: CreateClientInput,
  ): Promise<CreateClientOutput>;
  updateClient(updateClientInput: UpdateClientInput): Promise<ClientOutput>;
  deleteClient(): Promise<void>;
}
