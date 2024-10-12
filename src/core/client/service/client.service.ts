import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Image } from '../../../shared/services/image/image.service.js';
import { ClientList } from '../repositories/client.repository.js';

export type ClientInput = {
  name: string;
  email: string;
  phoneNumber: number;
  photoUrl?: string;
};

export type CreateClientInput = ClientInput;

export type UpdateClientInput = {
  id: string;
  name?: string;
  phoneNumber?: string;
  photo?: Image | null;
};

export type ClientOutput = {
  id: string;
  name: string;
  email: string;
  phoneNumber: number;
  photoUrl: string | undefined;
};

export interface ClientService {
  getClient(pagination: PaginationInput): Promise<PaginationOutput<ClientList>>;
  getClientById(id: string): Promise<ClientOutput>;
  // createClient(createClientInput: CreateClientInput): Promise<ClientOutput>;
  updateClient(updateClientInput: UpdateClientInput): Promise<ClientOutput>;
}
