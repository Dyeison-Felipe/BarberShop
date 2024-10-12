import { BarberService } from '../../entities/barber-service.entity.js';
import { BarberServiceRepository } from '../barber-service.repository.js';

export class BarberServiceFirebaseRepository
  implements BarberServiceRepository
{
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}
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
}
