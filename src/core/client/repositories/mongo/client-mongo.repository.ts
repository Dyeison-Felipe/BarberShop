import { Document } from 'mongoose';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { NullableOptional } from '../../../../shared/utils/types.js';
import { Client, ClientProps } from '../../entities/client.entity.js';
import { ClientSchema } from '../../schema/mongo/client.schema.js';
import { ClientList, ClientRepository } from '../client.repository.js';
import { MongoPagination } from '../../../../shared/repositories/mongo/pagination.js';

export class ClientMongoRepository implements ClientRepository {
  async getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>> {
    const query = ClientSchema.find();

    const { documents, meta } = await MongoPagination.paginate(
      query,
      pagination,
    );

    const clientList: ClientList[] = documents.map((document) => ({
      id: document.id,
      name: document.name,
      photoUrl: document.photoUrl,
      rating: document.rating,
      email: document.email,
      phoneNumber: document.phoneNumber,
    }));

    return {
      data: clientList,
      meta,
    };
  }

  async getClientById(id: string): Promise<Client | null> {
    const document = await ClientSchema.findById(id);

    if (!document) {
      return null;
    }

    const clientEntity = this.documentToEntity(document);

    return clientEntity;
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const document = await ClientSchema.findOne({ email });

    if (!document) {
      return null;
    }

    const clientEntity = this.documentToEntity(document);

    return clientEntity;
  }

  async createClient(client: Client): Promise<Client | null> {
    try {
      const { id, ...json } = client.toObject();
      const clientSchema = new ClientSchema({ _id: id, ...json });
      await clientSchema.save();
      return client;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateClient(client: Client): Promise<Client | null> {
    try {
      const { id, ...json } = client.toObject();
      const clientSchema = new ClientSchema({ _id: id, ...json });
      clientSchema.isNew = false;
      await clientSchema.save();
      return client;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const result = await ClientSchema.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private documentToEntity(
    document: Document & NullableOptional<ClientProps>,
  ): Client {
    const clientProps: ClientProps = {
      id: document.id,
      email: document.email!,
      name: document.name!,
      password: document.password!,
      phoneNumber: document.phoneNumber!,
      photoUrl: document.photoUrl!,
    };

    const clientEntity = new Client(clientProps);

    return clientEntity;
  }
}
