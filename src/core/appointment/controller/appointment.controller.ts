import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Middleware,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { Query } from '../../../shared/decorators/http/route-param.decorator.js';
import {
  PaginationOutput,
  PaginationInput,
} from '../../../shared/repositories/pagination.repository.js';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto.js';
import { ReturnCreateAppointmentDto } from '../dtos/return-crete-appointment.dto.js';
import { ReturnGetBarberShopAppointmentsDto } from '../dtos/return-get-barber-shop-appointments.dto.js';
import { ReturnGetClientAppointmentsDto } from '../dtos/return-get-client-appointments.dto.js';
import { AppointmentService } from '../service/appointment.service.js';

@Controller('/api/appointment/v1')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Middleware('AuthMiddleware')
  @Get('/client-appointments')
  async getClientAppointments(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetClientAppointmentsDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.appointmentService.getClientAppointments({
      pagination,
    });

    return result;
  }

  @Middleware('AuthMiddleware')
  @Get('/barber-shop-appointments/barber-shop-id/:barberShopId')
  async getBarberShopAppointments(
    @Param('barberShopId') barberShopId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetBarberShopAppointmentsDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.appointmentService.getBarberShopAppointments({
      barberShopId,
      pagination,
    });

    return result;
  }

  @Middleware('AuthMiddleware')
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
