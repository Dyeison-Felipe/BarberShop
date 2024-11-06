import { admin } from '../../../../shared/repositories/firebase/config.js';
import { FirebasePagination } from '../../../../shared/repositories/firebase/pagination.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { BarberShopList } from '../../../barber-shop/repositories/barber-shop.repository.js';
import { Appointment } from '../../entities/appoiment.entity.js';
import {
  AppointmentRepository,
  BarberShopAppointment,
  ClientAppointment,
} from '../appointment.repository.js';

export class AppointmentFirebaseRepository implements AppointmentRepository {
  constructor(
    private readonly firebaseRepository: FirebaseFirestore.Firestore,
  ) {}

  async getAppointmentsByBarberId(
    barberShopId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopAppointment>> {
    console.log(
      '🚀 ~ AppointmentFirebaseRepository ~ barberShopId:',
      barberShopId,
    );
    const query = this.firebaseRepository
      .collection('Appointment')
      .where('barberShopId', '==', barberShopId)
      .orderBy(admin.firestore.FieldPath.documentId());

    const { snapshot, meta } = await FirebasePagination.paginate(
      query,
      pagination,
    );
    console.log('🚀 ~ AppointmentFirebaseRepository ~ snapshot:', snapshot);

    const appointments: BarberShopAppointment[] = await Promise.all(
      snapshot.docs.map(async (element) => {
        const elementData = element.data();
        const barberServicesPromise = this.firebaseRepository
          .collection('Barber-Service')
          .doc(elementData.barberServiceId)
          .get();

        const clientPromise = this.firebaseRepository
          .collection('Client')
          .doc(elementData.clientId)
          .get();

        const [barberServiceSnapshot, barberShopSnapshot] = await Promise.all([
          barberServicesPromise,
          clientPromise,
        ]);

        const barberService = barberServiceSnapshot.data();
        const barberShop = barberShopSnapshot.data();

        if (!barberShop) {
          throw new Error('Houve um erro ao encontrar a barbearia');
        }

        if (!barberService) {
          throw new Error('Houve um erro ao encontrar o serviço da barbearia');
        }

        return {
          id: element.id,
          date: elementData.date,
          client: {
            id: barberShopSnapshot.id,
            name: barberShop.name,
            photoUrl: barberShop.photoUrl,
          },
          service: {
            id: barberServiceSnapshot.id,
            name: barberService.name,
            price: barberService.price,
          },
        };
      }),
    );

    return {
      data: appointments,
      meta,
    };
  }

  async getAppointmentsByClientId(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientAppointment>> {
    const query = this.firebaseRepository
      .collection('Appointment')
      .where('clientId', '==', clientId)
      .orderBy(admin.firestore.FieldPath.documentId());

    const { snapshot, meta } = await FirebasePagination.paginate(
      query,
      pagination,
    );

    snapshot.docs.forEach((element) => {
      console.log(
        '🚀 ~ AppointmentFirebaseRepository ~ snapshot.docs.forEach ~ element:',
        element.data(),
      );
    });

    const appointments: ClientAppointment[] = await Promise.all(
      snapshot.docs.map(async (element) => {
        const elementData = element.data();
        const barberServicesPromise = this.firebaseRepository
          .collection('Barber-Service')
          .doc(elementData.barberServiceId)
          .get();

        const barberShopPromise = this.firebaseRepository
          .collection('Barber-Shop')
          .doc(elementData.barberShopId)
          .get();

        const [barberServiceSnapshot, barberShopSnapshot] = await Promise.all([
          barberServicesPromise,
          barberShopPromise,
        ]);

        const barberService = barberServiceSnapshot.data();
        const barberShop = barberShopSnapshot.data();

        if (!barberShop) {
          throw new Error('Houve um erro ao encontrar a barbearia');
        }

        if (!barberService) {
          throw new Error('Houve um erro ao encontrar o serviço da barbearia');
        }

        return {
          id: element.id,
          date: elementData.date,
          barber: {
            id: barberShopSnapshot.id,
            name: barberShop.name,
            photoUrl: barberShop.photoUrl,
          },
          service: {
            id: barberServiceSnapshot.id,
            name: barberService.name,
            price: barberService.price,
          },
        };
      }),
    );

    return {
      data: appointments,
      meta,
    };
  }

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
