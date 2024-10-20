import { AppointmentModule } from './core/appointment/modules/appointment.module.js';
import { BarberOpeningHoursModule } from './core/barber-opening-hour/modules/barber-opening-hour.module.js';
import { BarberServiceModule } from './core/barber-service/modules/barber-service.module.js';
import { BarberShopModule } from './core/barber-shop/modules/barber-shop.module.js';
import { ClientModule } from './core/client/modules/client.module.js';
import { IModule } from './shared/modules/module.js';

type Module = new () => IModule;

type BuildAppModule = {
  modules: Module[];
};

interface IAppModule {
  buildAppModule(): BuildAppModule;
}

export class AppModule implements IAppModule {
  buildAppModule(): BuildAppModule {
    return {
      modules: [
        BarberShopModule,
        ClientModule,
        BarberServiceModule,
        BarberOpeningHoursModule,
        AppointmentModule,
      ],
    };
  }
}
