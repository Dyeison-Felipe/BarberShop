import { IMiddleware } from '../middlewares/middleware.js';

export type Middleware = {
  provide: string;
  instance: IMiddleware;
  isGlobal?: boolean;
};

export type BuildModule = {
  controllers: Object[];
  middlewares?: Middleware[];
};

export interface IModule {
  buildModule(): BuildModule;
}
