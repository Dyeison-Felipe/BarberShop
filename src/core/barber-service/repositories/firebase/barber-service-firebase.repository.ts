import { FirebaseRemoveDeleted } from '../../../../shared/repositories/firebase/remove-deleted.js';
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

  async getBarberShopServiceId(
    barberShopId: string,
  ): Promise<BarberService[] | null> {
    const snapshot = await FirebaseRemoveDeleted.remove(
      this.firebaseRepository
        .collection('Barber-Service')
        .where('barberShopId', '==', barberShopId),
    ).get();

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
        isDeleted: data.isDeleted,
      });
    });

    return services;
  }

  async getBarberServiceById(
    barberServiceId: string,
  ): Promise<BarberService | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Service')
      .doc(barberServiceId)
      .get();

    const barberServiceData = snapshot.data();

    if (!snapshot.exists || !barberServiceData || barberServiceData?.isDelete) {
      return null;
    }

    const barberService = new BarberService({
      id: snapshot.id,
      barberShopId: barberServiceData.barberShopId,
      duration: barberServiceData.duration,
      name: barberServiceData.name,
      price: barberServiceData.price,
      isDeleted: barberServiceData.isDeleted,
    });

    return barberService;
  }

  async save(barberService: BarberService): Promise<BarberService | null> {
    try {
      const { id, ...barberServiceData } = barberService.toJSON();
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

  async updateBarberService(
    barberService: BarberService,
  ): Promise<BarberService | null> {
    try {
      const { id, ...barberShopData } = barberService.toJSON();
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

  async deleteBarberService(barberServiceId: string): Promise<boolean> {
    try {
      await this.firebaseRepository
        .collection('Barber-Service')
        .doc(barberServiceId)
        .update({ isDeleted: true });

      return true;
    } catch (error) {
      return false;
    }
  }
}
