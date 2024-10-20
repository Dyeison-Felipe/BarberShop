import { OpeningHours } from '../../entities/barber-opening-hour.entity.js';
import { CreateOpeningHoursInput, ReturnGetBarberOpeningHoursOutput } from '../../services/barber-opening-hour.service.js';
import {
  GetAllBarberOpeningHours,
  BarberOpeningHoursRepository,
} from '../barber-opening-hour.repository.js';

export class BarberOpeningHoursFirebaseRepository
  implements BarberOpeningHoursRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}


  async getAllByBarberShopId(
    barberShopId: string,
  ): Promise<GetAllBarberOpeningHours[]> {
    const snapshot = await this.firebaseRepository
      .collection('Barber-Opening-Hours')
      .where('barberShopId', '==', barberShopId)
      .get();

    const barberShopList: GetAllBarberOpeningHours[] = [];
    snapshot.forEach((element) => {
      const elementData = element.data();
      barberShopList.push({
        id: element.id,
        barberShopId: elementData.barberShopId,
        end: elementData.end,
        start: elementData.start,
        weekday: elementData.weekday,
      });
    });

    return barberShopList;
  }

  async createOpeningHours(openingHours: OpeningHours): Promise<OpeningHours | null> {
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
