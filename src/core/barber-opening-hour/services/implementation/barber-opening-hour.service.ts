import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';
import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { OpeningHours } from '../../entities/barber-opening-hour.entity.js';
import { BarberOpeningHoursRepository } from '../../repositories/barber-opening-hour.repository.js';
import {
  BarberOpeningHoursService,
  OpeningHourOutput,
  CreateOpeningHoursInput,
  ReturnGetBarberOpeningHoursOutput,
  UpsertOpeningHoursOutput,
  UpdateOpeningHours,
} from '../barber-opening-hour.service.js';

export class BarberOpeningHoursServiceImpl
  implements BarberOpeningHoursService
{
  constructor(
    private readonly barberOpeningHoursRepository: BarberOpeningHoursRepository,
  ) {}
  async getBarberOpeningHours(
    barberShopId: string,
  ): Promise<ReturnGetBarberOpeningHoursOutput> {
    const barberOpeningHours =
      await this.barberOpeningHoursRepository.getAllByBarberShopId(
        barberShopId,
      );

    const weekdaysMap: Record<string, OpeningHourOutput[]> = {};

    // Agrupa os horários por dia da semana
    barberOpeningHours.forEach(({ weekday, start, end, id }) => {
      if (!weekdaysMap[weekday]) {
        weekdaysMap[weekday] = [];
      }
      weekdaysMap[weekday].push({ start, end, id });
    });

    // Converte o mapa em um array de objetos no formato ReturnGetBarberOpeningHoursOutput
    const weekdays = Object.entries(weekdaysMap).map(
      ([name, openingHours]) => ({
        name,
        openingHours: openingHours.sort(
          (a, b) => +a.start.split(':')[0] - +b.start.split(':')[0],
        ),
      }),
    );

    const correctOrder = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];

    weekdays.sort(
      (a, b) => correctOrder.indexOf(a.name) - correctOrder.indexOf(b.name),
    );

    return { weekdays };
  }

  async deleteOpeningHours(id: string): Promise<void> {
    const openingHour =
      await this.barberOpeningHoursRepository.getOpeningHourById(id);

    if (!openingHour) {
      throw new ResourceNotFoundError('Usuário não encontrado');
    }

    const deleteOpeningHours =
      await this.barberOpeningHoursRepository.deleteOpeningHours(id);

    if (deleteOpeningHours === null) {
      throw new InternalServerError('Erro ao deletar');
    }
  }

  async updateOpeningHours(
    updateOpeningHours: UpdateOpeningHours[],
  ): Promise<UpsertOpeningHoursOutput> {
    const barberOpeningHours =
      await this.barberOpeningHoursRepository.getAllByBarberShopId(
        updateOpeningHours[0].barberShopId,
      );

    barberOpeningHours.forEach((currentBarberOpeningHour) => {
      updateOpeningHours.forEach((updateBarberOpeningHour) => {
        if (currentBarberOpeningHour.id === updateBarberOpeningHour.id) {
          currentBarberOpeningHour.updateOpeningHours(updateBarberOpeningHour);
        }
      });
    });

    const updatedOpeningHours =
      await this.barberOpeningHoursRepository.updateManyOpeningHours(
        barberOpeningHours,
      );

    if (!updatedOpeningHours) {
      throw new InternalServerError('Erro ao atualizar horários');
    }

    return { weekdays: updatedOpeningHours };
  }

  async createOpeningHours(
    createOpeningHoursInput: CreateOpeningHoursInput,
  ): Promise<UpsertOpeningHoursOutput> {
    const createdOpeningHours = await Promise.all(
      createOpeningHoursInput.created.map(async (hoursCreated) => {
        const openingHoursEntity = OpeningHours.createOpeningHours({
          ...hoursCreated,
        });

        const newOpeningHours =
          await this.barberOpeningHoursRepository.createOpeningHours(
            openingHoursEntity,
          );

        if (!newOpeningHours) {
          throw new InternalServerError('Erro ao criar as horas');
        }

        return newOpeningHours;
      }),
    );

    await Promise.all(
      createOpeningHoursInput.deleted.map((hoursDeleted) =>
        this.barberOpeningHoursRepository.deleteOpeningHours(hoursDeleted.id),
      ),
    );

    const createOpeningHoursOutput: UpsertOpeningHoursOutput = {
      weekdays: createdOpeningHours.map((hours) => hours.toObject()),
    };

    return createOpeningHoursOutput;
  }
}
