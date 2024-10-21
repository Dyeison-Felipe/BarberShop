import {
  PaginationInput,
  PaginationOutput,
} from "../../../shared/repositories/pagination.repository.js";
import { Image } from "../../../shared/services/image/image.service.js";
import { ClientList } from "../repositories/client.repository.js";

export type ClientInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateClientInput = ClientInput;

export type UpdateClientInput = {
  id: string;
  name?: string;
  phoneNumber?: string;
  photo?: Image | null;
};

export type CreateClientOutput = {
  id: string;
  name: string;
  email: string;
};

export type UpdateClientOutput = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
};

export interface ClientService {
  getClient(pagination: PaginationInput): Promise<PaginationOutput<ClientList>>;
  getClientById(id: string): Promise<UpdateClientOutput>;
  createClient(
    createClientInput: CreateClientInput
  ): Promise<CreateClientOutput>;
  updateClient(
    updateClientInput: UpdateClientInput
  ): Promise<UpdateClientOutput>;
  deleteClient(id: string): Promise<void>;
}
