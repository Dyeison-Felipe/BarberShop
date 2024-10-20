export class ReturnGetClientAppointmentsDto {
  id: string;
  date: Date;
  service: GetClientAppointmentService;
  barber: GetClientAppointmentBarber;
}

class GetClientAppointmentService {
  id: string;
  name: string;
  price: number;
}

class GetClientAppointmentBarber {
  id: string;
  photoUrl: string;
  name: string;
}
