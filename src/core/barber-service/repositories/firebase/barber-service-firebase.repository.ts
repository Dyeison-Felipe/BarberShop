import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { BarberService } from '../../entities/barber-service.entity.js';
import {
  BarberServiceRepository,
  ServiceList,
} from '../barber-service.repository.js';

export class BarberServiceFirebaseRepository
  implements BarberServiceRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}

  async getBarberServiceById(
    barberServiceId: string,
  ): Promise<BarberService | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Service')
      .doc(barberServiceId)
      .get();

    const barberServiceData = snapshot.data();

    if (!snapshot.exists || !barberServiceData) {
      return null;
    }

    const barberService = new BarberService({
      id: snapshot.id,
      barberShopId: barberServiceData.barberShopId,
      duration: barberServiceData.duration,
      name: barberServiceData.name,
      price: barberServiceData.price,
    });

    return barberService;
  }

  async updateBarberService(
    barberService: BarberService,
  ): Promise<BarberService | null> {
    try {
      const { id, ...barberShopData } = barberService.toObject();
      const db = await this.firebaseRepository
        .collection('Barber-Service')
        .doc(id)
        .set(barberShopData);

      return barberService;
    } catch (error) {
      console.error(
        '🚀 ~ BarberShopFirebaseRepository ~ createBarberShop ~ error:',
        error,
      );
      return null;
    }
  }

  async getBarberShopServiceId(
    barberShopId: string,
  ): Promise<BarberService[] | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Service')
      .where('barberShopId', '==', barberShopId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const services: BarberService[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new BarberService({
        id: doc.id,
        name: data.name,
        price: data.price,
        duration: data.duration,
        barberShopId: data.barberShopId,
      });
    });

    return services;
  }

  async save(barberService: BarberService): Promise<BarberService | null> {
    try {
      const { id, ...barberServiceData } = barberService.toObject();
      await this.firebaseRepository
        .collection('Barber-Service')
        .doc(id)
        .set(barberServiceData);
      return barberService;
    } catch (error) {
      console.log(
        '🚀 ~ BarberServiceFirebaseRepository ~ createBarberService ~ error:',
        error,
      );
      return null;
    }
  }

  async deleteBarberService(barberServiceId: string): Promise<void | null> {
    try {
      await this.firebaseRepository
        .collection('Barber-Service')
        .doc(barberServiceId)
        .delete();
    } catch (error) {
      return null;
    }
  }
}
