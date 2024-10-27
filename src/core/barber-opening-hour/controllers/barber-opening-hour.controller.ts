import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "../../../shared/decorators/http/request-mapping.decorator.js";
import { ReturnGetBarberOpeningHoursDto } from "../dtos/return-get-barber-opening-hours.dto.js";
import {
  BarberOpeningHoursService,
  UpdateOpeningHours,
} from "../services/barber-opening-hour.service.js";
import { CreateOpeningHoursDtoArray } from "../dtos/create-opening-hours.dto.js";
import { ReturnCreateOpeningHoursDto } from "../dtos/return-create-opening-hours.dto.js";
import {
  UpdateOpeningHoursArrayDto,
  UpdateOpeningHoursDto,
} from "../dtos/update-opening-hours.dto.js";
import { ReturnOpeningHoursDto } from "../dtos/return-update-opening-hours.dto.js";

@Controller("/api/barber-opening-hours/v1")
export class BarberOpeningHoursController {
  constructor(
    private readonly barberOpeningHoursService: BarberOpeningHoursService
  ) {}

  @Get("barber-shop-id/:barberId")
  async getBarberOpeningHours(
    @Param("barberId") barberId: string
  ): Promise<ReturnGetBarberOpeningHoursDto> {
    const result = await this.barberOpeningHoursService.getBarberOpeningHours(
      barberId
    );

    return result;
  }

  @Post("/create")
  async createOpeningHours(
    @Body() createOpeningHoursDtoArray: CreateOpeningHoursDtoArray
  ): Promise<ReturnCreateOpeningHoursDto> {
    console.log(
      "🚀 ~ BarberOpeningHoursController ~ createOpeningHours ~ createOpeningHoursDtoArray:",
      createOpeningHoursDtoArray
    );
    const createOpeningHours =
      await this.barberOpeningHoursService.createOpeningHours(
        createOpeningHoursDtoArray.weekdays
      );

    return createOpeningHours;
  }

  @Put('/update')
  async updateOpeningHours(
    @Body() updateOpeningHoursDto: UpdateOpeningHoursArrayDto
  ): Promise<ReturnOpeningHoursDto> {
    const updateOpeningHours =
      await this.barberOpeningHoursService.updateOpeningHours(
        updateOpeningHoursDto.weekdays
      );

    return updateOpeningHours;
  }

  @Delete('/:id')
  async deleteOpeningHours(@Param('id') id: string): Promise<void> {
    await this.barberOpeningHoursService.deleteOpeningHours(id);
  }
}
