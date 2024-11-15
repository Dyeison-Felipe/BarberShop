import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { Query } from '../../../shared/decorators/http/route-param.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { ClientService } from '../service/client.service.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { ReturnCreateClientDto } from '../dto/return-create-client.dto.js';
import { ReturnGetClientDto } from '../dto/return-get-client.dto.js';
import { ReturnUpdateClientDto } from '../dto/return-update-client.dto.js';
import { UpdateClientDto } from '../dto/update-client.dto.js';
import { upload } from '../../../shared/configs/multer-config.js';
import { parseFormDataDto } from '../../../shared/middlewares/parse-form-data-dto.middleware.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';

@Controller('/api/client/v1')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getClient(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetClientDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.clientService.getClient(pagination);
    return result;
  }

  @Middleware('AuthMiddleware')
  @Get('client-id')
  async getClientById(): Promise<ReturnGetClientDto> {
    const client = await this.clientService.getClientById();

    return client;
  }

  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<ReturnCreateClientDto> {
    const client = await this.clientService.createClient(createClientDto);

    return client;
  }

  @Middleware('AuthMiddleware')
  @Middleware(upload.single('file'), parseFormDataDto)
  @Put()
  async updateClient(
    req: Request,
    @Body() updateClient: UpdateClientDto,
  ): Promise<ReturnUpdateClientDto> {
    const client = await this.clientService.updateClient({
      photo: ImageFirebaseStorageService.imageAdapter(req.file),
      ...updateClient,
    });

    return client;
  }

  @Middleware('AuthMiddleware')
  @Delete()
  async deleteClient(_: Request, res: Response): Promise<void> {
    await this.clientService.deleteClient();
    res.status(204).send();
  }
}
