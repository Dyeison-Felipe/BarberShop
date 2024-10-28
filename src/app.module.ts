import { AppointmentModule } from './core/appointment/modules/appointment.module.js';
import { AuthModule } from './core/auth/module/auth.module.js';
import { BarberOpeningHoursModule } from './core/barber-opening-hour/modules/barber-opening-hour.module.js';
import { BarberServiceModule } from './core/barber-service/modules/barber-service.module.js';
import { BarberShopModule } from './core/barber-shop/modules/barber-shop.module.js';
import { ClientFavoriteListModule } from './core/client-favorite-list/modules/client-favorite.module.js';
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
        AuthModule,
        ClientFavoriteListModule
      ],
    };
  }
}
