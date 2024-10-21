import { PaginationInput, PaginationOutput } from '../../../../shared/repositories/pagination.repository.js';
import { BarberService } from '../../entities/barber-service.entity.js';
import { BarberServiceRepository, ServiceList } from '../../repositories/barber-service.repository.js';
import {
  BarberServiceOutput,
  BarberServiceService,
  CreateBarberServiceInput,
} from '../barber-service.service.js';

export class BarberServiceServiceImpl implements BarberServiceService {
  constructor(
    private readonly barberServiceRepository: BarberServiceRepository,
  ) {}

  async getBarberShopServiceId(barberShopId: string): Promise<BarberServiceOutput[]> {
    const services = await this.barberServiceRepository.getBarberShopServiceId(barberShopId);
  
    if (!services) {
      throw new Error("Nenhum serviço encontrado");
    }
  
    return services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      barberShopId: service.barberShopId,
    }));
  }

  async createBarberService(
    createBarberServiceInput: CreateBarberServiceInput,
  ): Promise<BarberServiceOutput> {
    const barberServiceEntity = BarberService.createBarberService({
      ...createBarberServiceInput,
      // TODO Buscar o ID da autenticação
      barberShopId: '',
    });

    const createdBarberService = await this.barberServiceRepository.save(
      barberServiceEntity,
    );

    if (!createdBarberService) {
      throw new Error('Erro ao criar usuário');
    }

    const barberServiceOutput: BarberServiceOutput = {
      id: barberServiceEntity.id,
      barberShopId: barberServiceEntity.barberShopId,
      duration: barberServiceEntity.duration,
      name: barberServiceEntity.name,
      price: barberServiceEntity.price,
    };

    return barberServiceOutput;
  }
}
