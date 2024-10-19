import { Appointment } from '../../entities/appoiment.entity.js';
import { AppointmentRepository } from '../appointment.repository.js';

export class AppointmentFirebaseRepository implements AppointmentRepository {
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}

  async createAppointment(
    appointment: Appointment,
  ): Promise<Appointment | null> {
    try {
      const { id, ...appointmentData } = appointment.toObject();
      await this.firebaseRepository
        .collection('Appointment')
        .doc(id)
        .set(appointmentData);
      return appointment;
    } catch (error) {
      console.log(
        '🚀 ~ AppointmentFirebaseRepository ~ createAppointment ~ error:',
        error,
      );
      return null;
    }
  }
}
