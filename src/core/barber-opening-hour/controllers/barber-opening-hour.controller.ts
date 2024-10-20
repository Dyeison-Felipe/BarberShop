import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { ReturnGetBarberOpeningHoursDto } from './dtos/return-get-barber-opening-hours.dto.js';
import { BarberOpeningHoursService } from '../services/barber-opening-hour.service.js';
import { CreateOpeningHoursDtoArray } from './dtos/create-opening-hours.dto.js';
import { ReturnCreateOpeningHoursDto } from './dtos/return-create-opening-hours.dto.js';

@Controller('/api/barber-opening-hours/v1')
export class BarberOpeningHoursController {
  constructor(
    private readonly barberOpeningHoursService: BarberOpeningHoursService,
  ) {}

  @Get('barber-shop-id/:barberId')
  async getBarberOpeningHours(
    @Param('barberId') barberId: string,
  ): Promise<ReturnGetBarberOpeningHoursDto> {
    const result = await this.barberOpeningHoursService.getBarberOpeningHours(
      barberId,
    );

    return result;
  }

  @Post('/create')
  async createOpeningHours(@Body() createOpeningHoursDtoArray: CreateOpeningHoursDtoArray): Promise<ReturnCreateOpeningHoursDto> {
    console.log("🚀 ~ BarberOpeningHoursController ~ createOpeningHours ~ createOpeningHoursDtoArray:", createOpeningHoursDtoArray)
    const createOpeningHours = await this.barberOpeningHoursService.createOpeningHours(createOpeningHoursDtoArray.weekdays);

    return createOpeningHours;

  }
}
