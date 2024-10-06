import { Controller, Get, Post } from "../../../shared/decorators/http/request-mapping.decorator.js";
import { Query } from "../../../shared/decorators/http/route-param.decorator.js";
import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository.js";
import { ClientService } from "../service/client.service.js";
import { CreateClientDto } from "./dto/create-client.dto.js";
import { ReturnCreateClientDto } from "./dto/return-create-client.dto.js";
import { ReturnGetClientDto } from "./dto/return-get-client.dto.js";

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

  // @Post()
  // async createClient(req: Request): Promise<ReturnCreateClientDto> {
  //   const createClientDto: CreateClientDto = req.body;
  //   const client = await this.clientService.createClient(createClientDto);

  //   return client;
  // }
}