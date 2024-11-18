import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';
import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { BarberService } from '../../entities/barber-service.entity.js';
import { BarberServiceRepository } from '../../repositories/barber-service.repository.js';
import {
  BarberServiceOutput,
  BarberServiceService,
  CreateBarberServiceInput,
  UpdateBarberServiceInput,
} from '../barber-service.service.js';

export class BarberServiceServiceImpl implements BarberServiceService {
  constructor(
    private readonly barberServiceRepository: BarberServiceRepository,
  ) {}

  async getBarberShopServiceId(
    barberShopId: string,
  ): Promise<BarberServiceOutput[]> {
    const services = await this.barberServiceRepository.getBarberShopServiceId(
      barberShopId,
    );

    if (!services) {
      throw new ResourceNotFoundError('Nenhum serviço encontrado');
    }

    return services.map((service) => ({
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
    });

    const createdBarberService = await this.barberServiceRepository.save(
      barberServiceEntity,
    );

    if (!createdBarberService) {
      throw new ResourceNotFoundError('Erro ao criar usuário');
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

  async updateBarberService(
    updateBarberServiceInput: UpdateBarberServiceInput,
  ): Promise<BarberServiceOutput> {
    const barberService =
      await this.barberServiceRepository.getBarberServiceById(
        updateBarberServiceInput.id,
      );

    if (!barberService) {
      throw new ResourceNotFoundError(
        `Serviço do barbeiro com o ID ${updateBarberServiceInput.id} não foi encontrado`,
      );
    }

    barberService.updateBarberService(updateBarberServiceInput);

    const updatedBarberService =
      await this.barberServiceRepository.updateBarberService(barberService);

    if (!updatedBarberService) {
      throw new InternalServerError('Falha ao atualizar serviço do barbeiro');
    }

    const output = this.toUpdateOutput(updatedBarberService);

    return output;
  }

  async deleteBarberService(barberServiceId: string): Promise<void> {
    const barberService =
      await this.barberServiceRepository.getBarberServiceById(barberServiceId);

    if (!barberService) {
      throw new ResourceNotFoundError(
        `Serviço com o ID ${barberServiceId} não foi encontrado`,
      );
    }

    const deleteRes = await this.barberServiceRepository.deleteBarberService(
      barberServiceId,
    );

    if (!deleteRes) {
      throw new ResourceNotFoundError('Falha ao deletar serviço');
    }
  }

  private toUpdateOutput(barberService: BarberService): BarberServiceOutput {
    const barberServiceObject = barberService.toJSON();

    const output: BarberServiceOutput = {
      barberShopId: barberServiceObject.barberShopId,
      duration: barberServiceObject.duration,
      id: barberServiceObject.id,
      name: barberServiceObject.name,
      price: barberServiceObject.price,
    };

    return output;
  }
}
