import { NextFunction, request, Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middleware,
  Param,
  Post,
  Put,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnGetBarberShopDto } from '../dto/return-get-barber-shop.dto.js';
import { Query } from '../../../shared/decorators/http/route-param.decorator.js';
import { CreateBarberShopDto } from '../dto/create-barber-shop.dto.js';
import { ReturnCreateBarberShopDto } from '../dto/return-create-barber-shop.dto.js';
import { ReturnUpdateBarberShopDto } from '../dto/return-update-barber-shop.dto.js';
import { UpdateBarberShopDto } from '../dto/update-barber-shop.dto.js';
import { upload } from '../../../shared/configs/multer-config.js';
import { parseFormDataDto } from '../../../shared/middlewares/parse-form-data-dto.middleware.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';
import { ReturnGetBarberShopProfileDto } from '../dto/return-get-barber-shop-profile.dto.js';

@Controller('/api/barber-shop/v1')
export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  @Get()
  async getBarberShop(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetBarberShopDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.barberShopService.getBarbersShop(pagination);
    return result;
  }

  @Get('/barber-shop-id/:barberShopId')
  async getBarberShopProfile(
    @Param('barberShopId') barberShopId: string,
  ): Promise<ReturnGetBarberShopProfileDto> {
    const output = await this.barberShopService.getBarbersShopProfile({
      id: barberShopId,
    });
    return output;
  }

  @Post()
  async createBarberShop(
    @Body() createBarberShopDto: CreateBarberShopDto,
  ): Promise<ReturnCreateBarberShopDto> {
    const barberShop = await this.barberShopService.createBarberShop(
      createBarberShopDto,
    );

    return barberShop;
  }

  @Middleware(upload.single('file'), parseFormDataDto)
  @Put('/:id')
  async updateBarberShop(
    req: Request,
    @Param('id') id: string,
    @Body() updateBarberShopDto: UpdateBarberShopDto,
  ): Promise<ReturnUpdateBarberShopDto> {
    console.log('🚀 ~ BarberShopController ~ req:', req);
    const barberShop = await this.barberShopService.updateBarberShop({
      id,
      photo: ImageFirebaseStorageService.imageAdapter(req.file),
      ...updateBarberShopDto,
    });

    return barberShop;
  }

  @Delete('/:id')
  async deleteBarberShop(
    @Param('id') id: string,
    res: Response,
  ): Promise<void> {
    try {
      await this.barberShopService.deleteBarberShop(id);
      res.status(200).json({ message: 'Barbearia excluída com sucesso.' });
    } catch (error) {
      res.status(404).json({ message: 'Erro ao deletar' });
    }
  }
}
