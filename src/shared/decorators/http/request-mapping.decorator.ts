import { NextFunction, Request, Response } from 'express';
import { resolveQueryParams } from './route-param.decorator.js';
import { Middleware } from '../../modules/module.js';
import { bodyValidationMiddleware } from '../../middlewares/body-validation.middleware.js';

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const routes: {
  [key: string]: {
    method: string;
    path: string;
    handler: Function;
    bodyClass?: Object;
  }[];
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

// Decorator @Middleware() para adicionar um middleware nas rotas
export function Middleware(...middlewares: string[] | Function[]) {
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

// Decorator @Valid para capturar o corpo da requisição
export function Valid(classDto?: new () => unknown) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    if (!target.body) {
      target.body = {};
    }

    if (!target.body[propertyKey]) {
      target.body[propertyKey] = [];
    }

    target.body[propertyKey][parameterIndex] = classDto;
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

export const validateRoutes = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    res.status(500).send({
      statusCode: 500,
      error: error.name,
      message: error.message ?? '',
    });
    return;
  }

  res.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: JSON.stringify(error),
  });
};

// Função para aplicar rotas no Express
export const applyRoutes = (
  app: any,
  controllerInstance: any,
  // Todos os middlewares da aplicação, baseados em classe
  controllerMiddleares?: Middleware[],
) => {
  const controllerName = controllerInstance.constructor.name;
  const controllerRoutes = routes[controllerName];
  const prefix = controllerInstance.prefix || '';

  if (controllerRoutes) {
    controllerRoutes.forEach((route) => {
      const fullPath = `${prefix}${route.path}`;
      // Todos os middlewares do método atual (nome das classes e funções)
      const middlewareProvides: string[] | Function[] =
        controllerInstance.middlewares?.[route.handler.name] || [];

      const classBasedMiddlewares = controllerMiddleares?.filter(
        (controllerMiddleware) =>
          middlewareProvides.some(
            (middleareProvide) =>
              middleareProvide === controllerMiddleware.provide,
          ),
      );

      const functionBasedMiddlewares = middlewareProvides.filter(
        (middlewareProvide) => typeof middlewareProvide === 'function',
      );

      // Obtem a classe de validação do body da rota
      const classBody = controllerInstance.body?.[route.handler.name]?.[0];
      console.log('classBody', classBody);
      functionBasedMiddlewares.push(
        (req: Request, res: Response, next: NextFunction) =>
          bodyValidationMiddleware(req, res, next, classBody),
      );

      app[route.method](
        fullPath,
        ...(classBasedMiddlewares?.map(
          (middleare) =>
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                return await middleare.instance.use.bind(middleare.instance)(
                  req,
                  res,
                  next,
                );
              } catch (error) {
                validateRoutes(res, error);
              }
            },
        ) ?? []),
        ...functionBasedMiddlewares,
        async (req: Request, res: Response) => {
          // try {
          const args: any[] = [req, res];
          // Resolver query params
          resolveQueryParams(req, controllerInstance, route.handler.name, args);

          resolveBodyParams(req, controllerInstance, route.handler.name, args);

          // Resolver route params (parâmetros da URL)
          resolveRouteParams(req, controllerInstance, route.handler.name, args);
          // Executar o método do controlador e capturar o retorno
          try {
            const result = await route.handler.apply(controllerInstance, args);
            if (result !== undefined) {
              // Enviar automaticamente o resultado como resposta
              res.send(result);
            }
          } catch (error) {
            validateRoutes(res, error);
          }
        },
      );
    });
  }
};
