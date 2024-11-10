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
    search?: string,
  ): Promise<PaginationOutput<BarberShopList>> {
    let query = this.firebaseRepository
      .collection('Barber-Shop')
      .orderBy(admin.firestore.FieldPath.documentId());

    if (search) {
      query = query.where('name', '==', search);
    }

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

  async getBarberShopByClientId(clientId: string): Promise<BarberShop | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Shop')
      .where('clientId', '==', clientId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const barberShopFound = snapshot.docs[0];

    const barberShopProps = {
      id: barberShopFound.id,
      ...barberShopFound.data(),
    } as BarberShopProps;
    console.log(
      '🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():',
      barberShopFound.data(),
    );

    const barberShopEntity = new BarberShop(barberShopProps);

    return barberShopEntity;
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

  async getBarberShopByCnpj(cnpj: string): Promise<BarberShop | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Shop')
      .where('cnpj', '==', cnpj)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const barberShopFound = snapshot.docs[0];

    const barberShopProps = {
      id: barberShopFound.id,
      ...barberShopFound.data(),
    } as BarberShopProps;
    console.log(
      '🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():',
      barberShopFound.data(),
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

  async deleteBarberShop(id: string): Promise<boolean> {
    try {
      const snapshot = await this.firebaseRepository
        .collection('Barber-Shop')
        .doc(id)
        .get();

      if (!snapshot.exists) {
        return false;
      }

      await this.firebaseRepository.collection('Barber-Shop').doc(id).delete();
      return true;
    } catch (error) {
      return false;
    }
  }
}
