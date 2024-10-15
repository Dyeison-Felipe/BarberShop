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
}
