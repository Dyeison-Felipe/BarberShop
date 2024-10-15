import {
  Controller,
  Get,
  Param,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { ReturnGetBarberOpeningHoursDto } from '../dtos/return-get-barber-opening-hours.dto.js';
import { BarberOpeningHoursService } from '../services/barber-opening-hour.service.js';

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
}
