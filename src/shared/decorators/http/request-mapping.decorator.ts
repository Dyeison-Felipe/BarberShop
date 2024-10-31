import { Request, Response } from 'express';
import { resolveQueryParams } from './route-param.decorator.js';
import { IMiddleware } from '../../middlewares/middleware.js';
import { Middleware } from '../../modules/module.js';

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

// // Decorator @Middleware() para adicionar um middleware nas rotas
// export function Middleware(...middlewares: Function[]) {
//   return function (target: any, propertyKey: string) {
//     if (!target.middlewares) {
//       target.middlewares = {};
//     }

//     if (!target.middlewares[propertyKey]) {
//       target.middlewares[propertyKey] = [];
//     }

//     // Armazena middlewares para a rota especificada
//     target.middlewares[propertyKey].push(...middlewares);
//   };
// }
// Decorator @Middleware() para adicionar um middleware nas rotas
export function Middleware(...middlewares: string[]) {
  return function (target: any, propertyKey: string) {
    if (!target.middlewares) {
      target.middlewares = {};
    }

    if (!target.middlewares[propertyKey]) {
      target.middlewares[propertyKey] = [];
    }

    // Armazena middlewares para a rota especificada
    target.middlewares[propertyKey].push(...middlewares);
  };
}

// Decorator para capturar o corpo da requisição
export function Body(param?: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    if (!target.bodyParams) {
      target.bodyParams = {};
    }

    if (!target.bodyParams[propertyKey]) {
      target.bodyParams[propertyKey] = [];
    }

    target.bodyParams[propertyKey][parameterIndex] = param;
  };
}

// Função para resolver e injetar o corpo da requisição
export function resolveBodyParams(
  req: Request,
  target: any,
  propertyKey: string,
  args: any[],
) {
  const bodyParams = target.bodyParams?.[propertyKey] || [];

  bodyParams.forEach((param: string | undefined, index: number) => {
    if (param) {
      args[index] = req.body[param]; // Injeta o valor específico do parâmetro
    } else {
      args[index] = req.body; // Injeta o objeto completo do corpo da requisição
    }
  });
}

export function Param(param?: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    if (!target.routeParams) {
      target.routeParams = {};
    }

    if (!target.routeParams[propertyKey]) {
      target.routeParams[propertyKey] = [];
    }

    target.routeParams[propertyKey][parameterIndex] = param;
  };
}

// Função para resolver e injetar os parâmetros de rota
export function resolveRouteParams(
  req: Request,
  target: any,
  propertyKey: string,
  args: any[],
) {
  const routeParams = target.routeParams?.[propertyKey] || [];

  routeParams.forEach((param: string | undefined, index: number) => {
    if (param) {
      args[index] = req.params[param]; // Injeta o valor do parâmetro de rota específico
    } else {
      args[index] = req.params; // Injeta o objeto completo de parâmetros de rota
    }
  });
}

// Função para aplicar rotas no Express
export function applyRoutes(
  app: any,
  controllerInstance: any,
  controllerMiddleares?: Middleware[],
) {
  const controllerName = controllerInstance.constructor.name;
  const controllerRoutes = routes[controllerName];
  const prefix = controllerInstance.prefix || '';

  if (controllerRoutes) {
    controllerRoutes.forEach((route) => {
      const fullPath = `${prefix}${route.path}`;
      const middlewareProvides: string[] =
        controllerInstance.middlewares?.[route.handler.name] || [];

      const middlewares = controllerMiddleares?.filter((controllerMiddleware) =>
        middlewareProvides.some(
          (middleareProvide) =>
            middleareProvide === controllerMiddleware.provide,
        ),
      );

      app[route.method](
        fullPath,
        ...(middlewares?.map((middleare) => middleare.instance.use) ?? []),
        async (req: Request, res: Response) => {
          const args: any[] = [req, res];
          // Resolver query params
          resolveQueryParams(req, controllerInstance, route.handler.name, args);

          resolveBodyParams(req, controllerInstance, route.handler.name, args);

          // Resolver route params (parâmetros da URL)
          resolveRouteParams(req, controllerInstance, route.handler.name, args);
          // Executar o método do controlador e capturar o retorno
          const result = await route.handler.apply(controllerInstance, args);
          // Enviar automaticamente o resultado como resposta
          if (result !== undefined) {
            res.send(result);
          }
        },
      );
    });
  }
}
