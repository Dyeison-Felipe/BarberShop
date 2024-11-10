import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { Client, ClientProps } from '../../entities/client.entity.js';
import { ClientList, ClientRepository } from '../client.repository.js';

export class ClientFirebaseRepository implements ClientRepository {
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}

  async getClientByEmail(email: string): Promise<Client | null> {
    const snapshot = await this.firebaseRepository
      .collection('Client')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const clientFound = snapshot.docs[0];

    const clientProps = {
      id: clientFound.id,
      ...clientFound.data(),
    } as ClientProps;
    console.log(
      '🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():',
      clientFound.data(),
    );

    const clientEntity = new Client(clientProps);

    return clientEntity;
  }

  async getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>> {
    const snapshot = await this.firebaseRepository.collection('Client').get();

    const clientList: ClientList[] = [];
    snapshot.forEach((element) => {
      clientList.push({
        id: element.id,
        ...element.data(),
      } as ClientList);
    });

    return {
      data: clientList,
      meta: {
        itemCount: 3,
        totalItems: 4,
        itemsPerPage: 5,
        totalPages: 6,
        currentPage: 7,
      },
    };
  }

  async createClient(client: Client): Promise<Client | null> {
    try {
      const { id, ...clientData } = client.toObject();
      const db = await this.firebaseRepository
        .collection('Client')
        .doc(id)
        .set(clientData);
      return client;
    } catch (error) {
      console.log(
        '🚀 ~ ClientFirebaseRepository ~ createClient ~ error:',
        error,
      );
      return null;
    }
  }

  async updateClient(client: Client): Promise<Client | null> {
    try {
      const { id, ...clientData } = client.toObject();
      console.log(
        '🚀 ~ ClientFirebaseRepository ~ updateClient ~ clientData:',
        clientData,
      );
      const db = await this.firebaseRepository
        .collection('Client')
        .doc(id)
        .set(clientData);
      return client;
    } catch (error) {
      console.log(
        '🚀 ~ ClientFirebaseRepository ~ createClient ~ error:',
        error,
      );
      return null;
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    const snapshot = await this.firebaseRepository
      .collection('Client')
      .doc(id)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const clientProps = {
      id: snapshot.id,
      ...snapshot.data(),
    } as ClientProps;
    console.log(
      '🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():',
      snapshot.data(),
    );

    const clientEntity = new Client(clientProps);

    return clientEntity;
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const snapshot = await this.firebaseRepository
        .collection('Client')
        .doc(id)
        .get();

      if (!snapshot.exists) {
        return false;
      }

      await this.firebaseRepository.collection('Client').doc(id).delete();

      return true;
    } catch (error) {
      return false;
    }
  }
}
