import { NextFunction, Request, Response } from 'express';
import { bodyValidationMiddleware } from '../../middlewares/body-validation.middleware.js';
import { Middleware } from '../../modules/module.js';
import {
  resolveBodyParams,
  routes,
} from '../http/request-mapping.decorator.js';
import { resolveQueryParams } from './route-param.js';
import { HttpError } from '../../errors/http-error.js';

export const validateRoutes = (res: Response, error: unknown) => {
  if (error instanceof HttpError) {
    console.error(JSON.stringify(error));
    res.status(error.httpStatusCode).send({
      statusCode: error.httpStatusCode,
      message: error.message ?? '',
      ...error.options,
    });
    return;
  }

  console.error(JSON.stringify(error));
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
  controllerMiddlewares?: Middleware[],
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

      const classBasedMiddlewares = controllerMiddlewares?.filter(
        (controllerMiddleware) =>
          middlewareProvides.some(
            (middlewareProvide) =>
              middlewareProvide === controllerMiddleware.provide,
          ),
      );

      const functionBasedMiddlewares = middlewareProvides.filter(
        (middlewareProvide) => typeof middlewareProvide === 'function',
      );

      // Obtém a classe de validação do body da rota
      const classBody = controllerInstance.body?.[route.handler.name]?.[0];

      functionBasedMiddlewares.push(
        (req: Request, res: Response, next: NextFunction) =>
          bodyValidationMiddleware(req, res, next, classBody),
      );

      app[route.method](
        fullPath,
        ...functionBasedMiddlewares.map(
          (middleware) =>
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                return await middleware(req, res, next);
              } catch (error) {
                validateRoutes(res, error);
              }
            },
        ),
        ...(classBasedMiddlewares?.map(
          (middleware) =>
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                return await middleware.instance.use.bind(middleware.instance)(
                  req,
                  res,
                  next,
                );
              } catch (error) {
                validateRoutes(res, error);
              }
            },
        ) ?? []),
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
