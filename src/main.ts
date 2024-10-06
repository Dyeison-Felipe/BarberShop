import express from 'express';
import { AppModule } from './app.module.js';
import { applyRoutes } from './shared/decorators/http/request-mapping.decorator.js';

function start() {
  const app = express();
  app.use(express.json());

  const port = 3333;

  const appModule = new AppModule();
  const { modules } = appModule.buildAppModule();

  modules.forEach((Module) => {
    const module = new Module();
    const { controllers } = module.buildModule();

    controllers.forEach((controller) => {
      applyRoutes(app, controller);
    });
  });

  app.listen(port, () => {
    console.log(`Server iss running http://localhost:${port}`);
  });
}

start();
