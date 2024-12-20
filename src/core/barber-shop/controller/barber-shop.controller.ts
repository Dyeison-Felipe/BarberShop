import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
  Valid,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnGetBarberShopDto } from '../dto/return-get-barber-shop.dto.js';
import {
  Param,
  Query,
} from '../../../shared/decorators/http/route-param.decorator.js';
import { CreateBarberShopDto } from '../dto/create-barber-shop.dto.js';
import { ReturnCreateBarberShopDto } from '../dto/return-create-barber-shop.dto.js';
import { ReturnUpdateBarberShopDto } from '../dto/return-update-barber-shop.dto.js';
import { UpdateBarberShopDto } from '../dto/update-barber-shop.dto.js';
import { upload } from '../../../shared/configs/multer-config.js';
import { parseFormDataDto } from '../../../shared/middlewares/parse-form-data-dto.middleware.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';
import { ReturnGetBarberShopProfileDto } from '../dto/return-get-barber-shop-profile.dto.js';
import { ReturnGetBarberShopClientDto } from '../dto/return-barber-shop-client.dto.js';

// Uso do padrão decorator para controle das rotas, método HTTP, middlewares e outros
@Controller('/api/barber-shop/v1')
export class BarberShopController {
  // Implementação da injeção de dependência, fazendo com que as dependências sejam invertidas
  // Possibilita não depender de implementações, mas de abstrações, como a interface BarberShopService
  constructor(private readonly barberShopService: BarberShopService) {}

  @Middleware('LoggedClientMiddleware')
  @Get()
  async getBarberShop(
    req: Request,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('search') search?: string,
  ): Promise<PaginationOutput<ReturnGetBarberShopDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.barberShopService.getBarbersShop(
      pagination,
      search,
    );
    return result;
  }

  @Middleware('AuthMiddleware')
  @Get('/barber-shop-client-id')
  async getBarberShopByClientId(): Promise<ReturnGetBarberShopClientDto | null> {
    const output = await this.barberShopService.getBarberShopByClientId();

    return output;
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

  @Middleware('AuthMiddleware')
  @Post()
  async createBarberShop(
    @Valid(CreateBarberShopDto)
    @Body()
    createBarberShopDto: CreateBarberShopDto,
  ): Promise<ReturnCreateBarberShopDto> {
    const barberShop = await this.barberShopService.createBarberShop(
      createBarberShopDto,
    );

    return barberShop;
  }

  @Middleware('AuthMiddleware')
  @Middleware(upload.single('file'), parseFormDataDto)
  @Put('/:id')
  async updateBarberShop(
    req: Request,
    @Param('id') id: string,

    @Valid(UpdateBarberShopDto)
    @Body()
    updateBarberShopDto: UpdateBarberShopDto,
  ): Promise<ReturnUpdateBarberShopDto> {
    console.log('🚀 ~ BarberShopController ~ req.file:', req.file);
    const barberShop = await this.barberShopService.updateBarberShop({
      id,
      photo: ImageFirebaseStorageService.imageAdapter(req.file),
      ...updateBarberShopDto,
    });

    return barberShop;
  }

  @Middleware('AuthMiddleware')
  @Delete('/:id')
  async deleteBarberShop(
    @Param('id') id: string,
    res: Response,
  ): Promise<void> {
    await this.barberShopService.deleteBarberShop(id);
    res.status(204).send();
  }
}
