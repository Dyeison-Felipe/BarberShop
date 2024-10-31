import express from 'express';
import cors from 'cors';
import { AppModule } from './app.module.js';
import { applyRoutes } from './shared/decorators/http/request-mapping.decorator.js';
import { Middleware } from './shared/modules/module.js';

function start() {
  const app = express();
  app.use(express.json());

  const corsOptions: cors.CorsOptions = {
    origin: process.env.FRONTEND_URL, // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
  };

  app.use(cors());

  const port = 3333;

  const appModule = new AppModule();
  const { modules } = appModule.buildAppModule();

  const allControllers: Object[] = [];
  const allMiddlewares: Middleware[] = [];

  modules.forEach((Module) => {
    const module = new Module();
    const { controllers, middlewares } = module.buildModule();

    controllers.forEach((controller) => {
      allControllers.push(controller);
    });

    middlewares?.forEach((middleare) => {
      allMiddlewares.push(middleare);
    });
  });

  allControllers.forEach((controller) => {
    applyRoutes(app, controller, allMiddlewares);
  });

  app.listen(port, () => {
    console.log(`Server iss running http://localhost:${port}`);
  });
}

start();
