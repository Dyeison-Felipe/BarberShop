import { Request, Response } from 'express';

// Objeto para armazenar rotas temporariamente
const routes: {
  [key: string]: { method: string; path: string; handler: Function }[];
} = {};

// Decorator para definir a rota GET
export function Get(path: string) {
  return function (target: any, propertyKey: string) {
    // Adiciona a rota ao objeto routes
    if (!routes[target.constructor.name]) {
      routes[target.constructor.name] = [];
    }
    routes[target.constructor.name].push({
      method: 'get',
      path,
      handler: target[propertyKey],
    });
  };
}

// Função para aplicar as rotas ao app Express
export function applyRoutes(app: any, controllerInstance: any) {
  const controllerName = controllerInstance.constructor.name;
  const controllerRoutes = routes[controllerName];

  if (controllerRoutes) {
    controllerRoutes.forEach((route) => {
      app[route.method](route.path, (req: Request, res: Response) => {
        route.handler.call(controllerInstance, req, res);
      });
    });
  }
}
