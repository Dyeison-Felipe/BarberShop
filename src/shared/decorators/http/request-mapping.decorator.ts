import { Request, Response } from 'express';
import { resolveQueryParams } from './route-param.decorator.js';

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const routes: {
  [key: string]: { method: string; path: string; handler: Function }[];
} = {};

// Decorator para registrar rotas HTTP `GET`
export function Get(path = '') {
  return function (target: any, propertyKey: string) {
    const formatedPath = formatPath(path);
    if (!routes[target.constructor.name]) {
      routes[target.constructor.name] = [];
    }
    routes[target.constructor.name].push({
      method: 'get',
      path: formatedPath,
      handler: target[propertyKey],
    });
  };
}

// Decorator `@Controller` para agrupar rotas
export function Controller(prefix: string = '') {
  return function (target: any) {
    const formatedPrefix = formatPath(prefix);
    target.prototype.prefix = formatedPrefix;
  };
}

// Função para aplicar rotas no Express
export function applyRoutes(app: any, controllerInstance: any) {
  const controllerName = controllerInstance.constructor.name;
  const controllerRoutes = routes[controllerName];
  const prefix = controllerInstance.prefix || '';

  if (controllerRoutes) {
    controllerRoutes.forEach((route) => {
      const fullPath = `${prefix}${route.path}`;
      app[route.method](fullPath, (req: Request, res: Response) => {
        const args: any[] = []; // Apenas para os parâmetros injetados pelos decorators
        // Resolver query params
        resolveQueryParams(req, controllerInstance, route.handler.name, args);
        // Chama o handler do controlador, passando apenas os parâmetros injetados
        route.handler.apply(controllerInstance, args);
      });
    });
  }
}
