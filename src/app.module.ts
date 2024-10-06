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
      modules: [BarberShopModule, ClientModule],
    };
  }
}
