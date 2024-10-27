import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository.js";
import { Client } from "../entities/client.entity.js";

export type ClientList = {
  id: string;
  name: string;
  email:string;
  photoUrl: string;
  phoneNumber: string;
};


export interface ClientRepository {
  getClient(pagination: PaginationInput):Promise<PaginationOutput<ClientList>>;
  getClientById(id: string): Promise<Client | null>;
  createClient(client: Client): Promise<Client | null>;
  updateClient(client: Client): Promise<Client | null>
  deleteClient(id: string): Promise<void>;
  getClientByEmail(email: string): Promise<Client | null>;

}