export class ReturnGetBarberShopAppointmentsDto {
  id: string;
  date: Date;
  service: GetBarberShopAppointmentService;
  client: GetBarberShopAppointmentClient;
}

class GetBarberShopAppointmentService {
  id: string;
  name: string;
  price: number;
}

class GetBarberShopAppointmentClient {
  id: string;
  photoUrl: string;
  name: string;
}
