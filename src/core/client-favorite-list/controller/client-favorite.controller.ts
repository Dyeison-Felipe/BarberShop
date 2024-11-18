import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Valid,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { ClientFavoriteService } from '../service/client-favorite.service.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { ReturnGetClientFavoriteList } from '../dtos/return-get-client-favorite-list.dto.js';
import {
  Param,
  Query,
} from '../../../shared/decorators/http/route-param.decorator.js';
import { CreateFavoriteListDto } from '../dtos/create-favorite-list.dto.js';
import { ReturnCreateFavoriteListDto } from '../dtos/return-favorite-list.dto.js';

@Controller('/api/favorite/v1')
export class ClientFavoriteController {
  constructor(private readonly clientFavoriteService: ClientFavoriteService) {}

  @Middleware('AuthMiddleware')
  @Get()
  async getClientFavoriteList(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetClientFavoriteList>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };

    const favoriteList = await this.clientFavoriteService.getClientFavoriteList(
      pagination,
    );

    return favoriteList;
  }

  @Middleware('AuthMiddleware')
  @Post('/create-favorite')
  async createFavoriteList(
    @Valid(CreateFavoriteListDto)
    @Body()
    createFavoriteListDto: CreateFavoriteListDto,
  ): Promise<ReturnCreateFavoriteListDto> {
    const favoriteList = await this.clientFavoriteService.createClientFavorite(
      createFavoriteListDto,
    );

    return favoriteList;
  }

  @Middleware('AuthMiddleware')
  @Delete('/:barberShopId')
  async deleteBarberShop(
    @Param('barberShopId') barberShopId: string,
    res: Response,
  ): Promise<void> {
    try {
      await this.clientFavoriteService.deleteClientFavorite(barberShopId);
      res.status(200).json({ message: 'Barbearia excluída com sucesso.' });
    } catch (error) {
      res.status(404).json({ message: 'Erro ao deletar' });
    }
  }
}
