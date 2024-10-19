import {
  Controller,
  Post,
  Body,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto.js';
import { ReturnCreateAppointmentDto } from '../dtos/return-crete-appointment.dto.js';
import { AppointmentService } from '../service/appointment.service.js';

@Controller('/api/appointment/v1')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<ReturnCreateAppointmentDto> {
    const appointment = await this.appointmentService.createAppointment(
      createAppointmentDto,
    );

    return appointment;
  }
}
