import {
  OpeningHours,
  OpeningHoursProps,
} from '../../entities/barber-opening-hour.entity.js';
import { BarberOpeningHoursRepository } from '../barber-opening-hour.repository.js';

export class BarberOpeningHoursFirebaseRepository
  implements BarberOpeningHoursRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}
  async getOpeningHourById(
    openingHourId: string,
  ): Promise<OpeningHours | null> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Opening-Hours')
      .doc(openingHourId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const openingHoursProps = {
      id: snapshot.id,
      ...snapshot.data(),
    } as OpeningHoursProps;
    console.log(
      '🚀 ~ ClientFirebaseRepository ~ getClientById ~ clientProps.snapshot.data():',
      snapshot.data(),
    );

    const openingHoursEntity = new OpeningHours(openingHoursProps);

    return openingHoursEntity;
  }

  async deleteOpeningHours(id: string): Promise<boolean> {
    try {
      await this.firebaseRepository
        .collection('Barber-Opening-Hours')
        .doc(id)
        .delete();

      return true;
    } catch (error) {
      return false;
    }
  }

  async updateManyOpeningHours(
    updateOpeningHours: OpeningHours[],
  ): Promise<OpeningHours[] | null> {
    try {
      await Promise.all(
        updateOpeningHours.map((updateOpeningHour) => {
          const { id, ...openingHoursData } = updateOpeningHour.toObject();
          return this.firebaseRepository
            .collection('Barber-Opening-Hours')
            .doc(id)
            .set(openingHoursData);
        }),
      );

      return updateOpeningHours;
    } catch (error) {
      console.log(
        '🚀 ~ OpeningHoursFirebaseRepository ~ createOpeningHours ~ error:',
        error,
      );
      return null;
    }
  }

  async getAllByBarberShopId(barberShopId: string): Promise<OpeningHours[]> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Opening-Hours')
      .where('barberShopId', '==', barberShopId)
      .get();

    const barberShopList: OpeningHours[] = [];
    snapshot.forEach((element) => {
      const elementData = element.data();
      const openingHours = new OpeningHours({
        id: element.id,
        barberShopId: elementData.barberShopId,
        end: elementData.end,
        start: elementData.start,
        weekday: elementData.weekday,
      });
      barberShopList.push(openingHours);
    });

    return barberShopList;
  }

  async createOpeningHours(
    openingHours: OpeningHours,
  ): Promise<OpeningHours | null> {
    try {
      const { id, ...openingHoursData } = openingHours.toObject();
      await this.firebaseRepository
        .collection('Barber-Opening-Hours')
        .doc(id)
        .set(openingHoursData);
      return openingHours;
    } catch (error) {
      console.log(
        '🚀 ~ OpeningHoursFirebaseRepository ~ createOpeningHours ~ error:',
        error,
      );
      return null;
    }
  }
}
