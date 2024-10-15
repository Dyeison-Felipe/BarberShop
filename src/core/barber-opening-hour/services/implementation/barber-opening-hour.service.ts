import { BarberOpeningHoursRepository } from '../../repositories/barber-opening-hour.repository.js';
import {
  BarberOpeningHoursService,
  OpeningHourOutput,
  ReturnGetBarberOpeningHoursOutput,
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
        openingHours,
      }),
    );

    const correctOrder = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

    weekdays.sort(
      (a, b) => correctOrder.indexOf(a.name) - correctOrder.indexOf(b.name),
    );

    return { weekdays };
  }
}
