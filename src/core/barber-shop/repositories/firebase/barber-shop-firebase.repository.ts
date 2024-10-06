import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { BarberShop } from '../../entities/barber-shop.entity.js';
import {
  BarberShopRepository,
  BarberShopList,
} from '../barber-shop.repository.js';

export class BarberShopFirebaseRepository implements BarberShopRepository {
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}
  async getBarbersShop(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopList>> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Shop')
      .get();

    const barberShopList: BarberShopList[] = [];
    snapshot.forEach((element) => {
      barberShopList.push({
        id: element.id,
        ...element.data(),
      } as BarberShopList);
    });

    return {
      data: barberShopList,
      meta: {
        itemCount: 3,
        totalItems: 4,
        itemsPerPage: 5,
        totalPages: 6,
        currentPage: 7,
      },
    };
  }
  async createBarberShop(barberShop: BarberShop): Promise<BarberShop | null> {

    try {
      const {id,...barberShopData} = barberShop.toObject();
      const db = await this.firebaseRepository.collection('Barber-Shop').doc(id).set(barberShopData);
      return barberShop;

    } catch (error) {
      console.log("🚀 ~ BarberShopFirebaseRepository ~ createBarberShop ~ error:", error)
      return null;
    }
  }
}
