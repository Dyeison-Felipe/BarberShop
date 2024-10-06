import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository.js";
import { ClientList } from "../repositories/client.repository.js";

export type ClientInput = {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export type CreateClientInput = ClientInput;

export type UpdateClientInput = ClientInput & { id: number };

export type ClientOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: number
}
export interface ClientService {
  getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>>;
  createClient(createClientInput: CreateClientInput): Promise<ClientOutput>;
}