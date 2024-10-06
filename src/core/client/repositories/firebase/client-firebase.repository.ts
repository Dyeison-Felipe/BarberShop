import { PaginationInput, PaginationOutput } from "../../../../shared/repositories/pagination.repository.js";
import { Client } from "../../entities/client.entity.js";
import { ClientList, ClientRepository } from "../client.repository.js";

export class ClientFirebaseRepository implements ClientRepository {
  constructor(private readonly firebaseRepository: FirebaseFirestore.Firestore) {}

  async getClient(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientList>> {
    const snapshot = await this.firebaseRepository
      .collection('Client')
      .get();

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
      const {id,...clientData} = client.toObject();
      const db = await this.firebaseRepository.collection('Client').doc(id).set(clientData);
      return client;

    } catch (error) {
      console.log("🚀 ~ ClientFirebaseRepository ~ createClient ~ error:", error)
      return null;
    }
  }
}