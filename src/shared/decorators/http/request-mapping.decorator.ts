import { Request, Response } from 'express';
import { resolveQueryParams } from './route-param.decorator.js';

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const routes: {
  [key: string]: { method: string; path: string; handler: Function }[];
} = {};

const requestMapping = (path: string, method: string) => {
  return function (target: any, propertyKey: string) {
    const formatedPath = formatPath(path);
    if (!routes[target.constructor.name]) {
      routes[target.constructor.name] = [];
    }
    routes[target.constructor.name].push({
      method: method,
      path: formatedPath,
      handler: target[propertyKey],
    });
  };
};

// Decorator para registrar rotas HTTP `GET` @Get()
export function Get(path = '') {
  return requestMapping(path, 'get');
}

// Decorator para registrar rotas HTTP `POST` @Post()
export function Post(path = '') {
  return requestMapping(path, 'post');
}

// Decorator para registrar rotas HTTP `PUT` @Put()
export function Put(path = '') {
  return requestMapping(path, 'put');
}

// Decorator para registrar rotas HTTP `PATCH` @Patch()
export function Patch(path = '') {
  return requestMapping(path, 'patch');
}

// Decorator para registrar rotas HTTP `DELETE` @Delete()
export function Delete(path = '') {
  return requestMapping(path, 'delete');
}

// Decorator `@Controller()` para agrupar rotas
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
      app[route.method](fullPath, async (req: Request, res: Response) => {
        const args: any[] = [req, res];
        // Resolver query params
        resolveQueryParams(req, controllerInstance, route.handler.name, args);
        // Executar o método do controlador e capturar o retorno
        const result = await route.handler.apply(controllerInstance, args);
        // Enviar automaticamente o resultado como resposta
        if (result !== undefined) {
          res.send(result);
        }
      });
    });
  }
}
