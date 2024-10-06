import { Request, Response } from 'express';

// Objeto para armazenar todas as rotas
const routes: {
  [key: string]: { method: string; path: string; handler: Function }[];
} = {};

// Função para registrar rotas (auxiliar interna)
function registerRoute(
  target: any,
  method: string,
  path: string,
  propertyKey: string,
) {
  if (!routes[target.constructor.name]) {
    routes[target.constructor.name] = [];
  }
  routes[target.constructor.name].push({
    method,
    path,
    handler: target[propertyKey],
  });
}

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

// Decorator `@Get()`
export function Get(path = '') {
  const formatedPath = formatPath(path);
  return function (target: any, propertyKey: string) {
    registerRoute(target, 'get', formatedPath, propertyKey);
  };
}

// Decorator `@Controller()`
export function Controller(prefix: string = '') {
  return function (target: any) {
    target.prototype.prefix = formatPath(prefix);
  };
}

// Função para aplicar as rotas ao app Express
export function applyRoutes(app: any, controllerInstance: any) {
  const controllerName = controllerInstance.constructor.name;
  const controllerRoutes = routes[controllerName];
  const prefix = controllerInstance.prefix || '';

  if (controllerRoutes) {
    controllerRoutes.forEach((route) => {
      const fullPath = `${prefix}${route.path}`;
      app[route.method](fullPath, (req: Request, res: Response) => {
        route.handler.call(controllerInstance, req, res);
      });
    });
  }
}
