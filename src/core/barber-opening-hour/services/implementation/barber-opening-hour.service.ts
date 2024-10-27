import { OpeningHours } from "../../entities/barber-opening-hour.entity.js";
import { BarberOpeningHoursRepository } from "../../repositories/barber-opening-hour.repository.js";
import {
  BarberOpeningHoursService,
  OpeningHourOutput,
  CreateOpeningHoursInput,
  ReturnGetBarberOpeningHoursOutput,
  UpsertOpeningHoursOutput,
  UpdateOpeningHours,
} from "../barber-opening-hour.service.js";

export class BarberOpeningHoursServiceImpl
  implements BarberOpeningHoursService
{
  constructor(
    private readonly barberOpeningHoursRepository: BarberOpeningHoursRepository
  ) {}
  async deleteOpeningHours(id: string): Promise<void> {

    const openingHour = await this.barberOpeningHoursRepository.getOpeningHourById(id);

    if(!openingHour) {
      throw new Error("Usuario não encontrado");
    }

    const deleteOpeningHours = await this.barberOpeningHoursRepository.deleteOpeningHours(id);

    if(deleteOpeningHours === null) {
      throw new Error("Erro ao deletar")
    }
  }

  async updateOpeningHours(
    updateOpeningHours: UpdateOpeningHours[]
  ): Promise<UpsertOpeningHoursOutput> {
    const barberOpeningHours =
      await this.barberOpeningHoursRepository.getAllByBarberShopId(
        updateOpeningHours[0].barberShopId
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
        barberOpeningHours
      );

    if (!updatedOpeningHours) {
      throw new Error('Erro ao atualizar horários')
    }
    
    return { weekdays: updatedOpeningHours };
  }

  async getBarberOpeningHours(
    barberShopId: string
  ): Promise<ReturnGetBarberOpeningHoursOutput> {
    const barberOpeningHours =
      await this.barberOpeningHoursRepository.getAllByBarberShopId(
        barberShopId
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
      })
    );

    const correctOrder = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

    weekdays.sort(
      (a, b) => correctOrder.indexOf(a.name) - correctOrder.indexOf(b.name)
    );

    return { weekdays };
  }

  async createOpeningHours(
    createOpeningHoursInput: CreateOpeningHoursInput[]
  ): Promise<UpsertOpeningHoursOutput> {
    console.log(
      "🚀 ~ createOpeningHours ~ createOpeningHoursInput:",
      createOpeningHoursInput
    );

    const createdOpeningHours = await Promise.all(
      createOpeningHoursInput.map(async (hours) => {
        const openingHoursEntity = OpeningHours.createOpeningHours({
          ...hours,
        });

        const newOpeningHours =
          await this.barberOpeningHoursRepository.createOpeningHours(
            openingHoursEntity
          );

        if (!newOpeningHours) {
          throw new Error("Erro ao criar as horas");
        }

        return newOpeningHours;
      })
    );

    const createOpeningHoursOutput: UpsertOpeningHoursOutput = {
      weekdays: createdOpeningHours.map((hours) => hours.toObject()),
    };

    return createOpeningHoursOutput;
  }
}
