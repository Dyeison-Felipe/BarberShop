import { MongoPagination } from '../../../../shared/repositories/mongo/pagination.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { Appointment } from '../../entities/appointment.js';
import { AppointmentSchema } from '../../schema/mongo/appointment.schema.js';
import {
  AppointmentRepository,
  BarberShopAppointment,
  ClientAppointment,
} from '../appointment.repository.js';

export class AppointmentMongoRepository implements AppointmentRepository {
  async getAppointmentsByClientId(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientAppointment>> {
    const query = AppointmentSchema.find({ clientId });

    const { documents, meta } = await MongoPagination.paginate(
      query,
      pagination,
    );

    const appointmentList: ClientAppointment[] = documents.map((document) => ({
      id: document._id,
      barber: document.barber,
      date: document.date,
      service: document.service,
    }));

    return {
      data: appointmentList,
      meta,
    };
  }

  async getAppointmentsByBarberId(
    barberId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopAppointment>> {
    const query = AppointmentSchema.find({ barberId });

    const { documents, meta } = await MongoPagination.paginate(
      query,
      pagination,
    );

    const appointmentList: BarberShopAppointment[] = documents.map(
      (document) => ({
        id: document.id,
        client: document.client,
        date: document.date,
        service: document.service,
      }),
    );

    return {
      data: appointmentList,
      meta,
    };
  }

  async createAppointment(
    appointment: Appointment,
  ): Promise<Appointment | null> {
    try {
      const { id, ...json } = appointment.toObject();
      const appointmentSchema = new AppointmentSchema({ _id: id, ...json });
      await appointmentSchema.save();
      return appointment;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
