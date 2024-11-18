import express from 'express';
import cors from 'cors';
import { AppModule } from './app.module.js';
import { Middleware } from './shared/modules/module.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { mongooseConnect } from './shared/repositories/mongo/config.js';
import { applyRoutes } from './shared/decorators/utils/request-mapping.js';

async function start() {
  const app = express();
  app.use(express.json());

  const corsOptions: cors.CorsOptions = {
    origin: process.env.ALLOWED_ORIGIN, // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.COOKIES_SECRET!, // chave para acessar os cookies
      resave: false, // evita gravar sessões sem alterações
      saveUninitialized: true, // salvar na guia anônima
    }),
  );

  // await mongooseConnect();

  const port = process.env.PORT;

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

    middlewares?.forEach((middleware) => {
      allMiddlewares.push(middleware);
    });
  });

  allControllers.forEach((controller) => {
    applyRoutes(app, controller, allMiddlewares);
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

start();
