import { Appointment } from '../entities/appoiment.entity.js';

export interface AppointmentRepository {
  createAppointment(appointment: Appointment): Promise<Appointment | null>;
}
