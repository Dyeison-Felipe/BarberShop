import { admin } from '../../../../shared/repositories/firebase/config.js';
import { FirebasePagination } from '../../../../shared/repositories/firebase/pagination.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import {
  BarberShop,
  BarberShopProps,
} from '../../entities/barber-shop.entity.js';
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
    const query = this.firebaseRepository
      .collection('Barber-Shop')
      .orderBy(admin.firestore.FieldPath.documentId());

    const { snapshot, meta } = await FirebasePagination.paginate(
      query,
      pagination,
    );

    const barberShopList: BarberShopList[] = [];
    snapshot.forEach((element) => {
      const elementData = element.data();
      barberShopList.push({
        id: element.id,
        name: elementData.name,
        photoUrl: elementData.photoUrl,
        rating: elementData.rating,
      });
    });

    return {
      data: barberShopList,
      meta,
    };
  }

  async getBarberShopById(id: string): Promise<BarberShop | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Shop')
      .doc(id)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const barberShopProps = {
      id: snapshot.id,
      ...snapshot.data(),
    } as BarberShopProps;
    console.log(
      '🚀 ~ BarberShopFirebaseRepository ~ getBarberShopById ~ barberShopProps.snapshot.data():',
      snapshot.data(),
    );

    const barberShopEntity = new BarberShop(barberShopProps);

    return barberShopEntity;
  }

  async createBarberShop(barberShop: BarberShop): Promise<BarberShop | null> {
    try {
      const { id, ...barberShopData } = barberShop.toObject();
      await this.firebaseRepository
        .collection('Barber-Shop')
        .doc(id)
        .set(barberShopData);
      return barberShop;
    } catch (error) {
      console.log(
        '🚀 ~ BarberShopFirebaseRepository ~ createBarberShop ~ error:',
        error,
      );
      return null;
    }
  }

  async update(barberShop: BarberShop): Promise<BarberShop | null> {
    try {
      const { id, ...barberShopData } = barberShop.toObject();
      const db = await this.firebaseRepository
        .collection('Barber-Shop')
        .doc(id)
        .set(barberShopData);
      return barberShop;
    } catch (error) {
      console.log(
        '🚀 ~ BarberShopFirebaseRepository ~ createBarberShop ~ error:',
        error,
      );
      return null;
    }
  }

  async deleteBarberShop(id: string): Promise<void> {
    try {
      const snapshot = await this.firebaseRepository
        .collection('Barber-Shop')
        .doc(id)
        .get();
  
      if (!snapshot.exists) {
        return;
      }
  
      await this.firebaseRepository.collection('Barber-Shop').doc(id).delete();
    } catch (error) {
      return;
    }
  }
}
