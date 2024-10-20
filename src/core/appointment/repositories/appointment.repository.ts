import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Appointment } from '../entities/appoiment.entity.js';

export type ClientAppointment = {
  id: string;
  date: Date;
  service: {
    id: string;
    name: string;
    price: number;
  };
  barber: {
    id: string;
    photoUrl: string;
    name: string;
  };
};

export interface AppointmentRepository {
  createAppointment(appointment: Appointment): Promise<Appointment | null>;

  getAppointmentsByClientId(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientAppointment>>;
}
