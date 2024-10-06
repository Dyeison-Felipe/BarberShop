import { Request, Response } from 'express';

// Decorator para query params
export function Query(param?: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    if (!target.queryParams) {
      target.queryParams = {};
    }

    if (!target.queryParams[propertyKey]) {
      target.queryParams[propertyKey] = [];
    }

    target.queryParams[propertyKey][parameterIndex] = param;
  };
}

// Função para resolver e injetar os query params
export function resolveQueryParams(
  req: Request,
  target: any,
  propertyKey: string,
  args: any[],
) {
  const queryParams = target.queryParams?.[propertyKey] || [];

  queryParams.forEach((param: string | undefined, index: number) => {
    if (param) {
      args[index] = req.query[param]; // Injeta o valor específico do parâmetro
    } else {
      args[index] = req.query; // Injeta o objeto completo de query string
    }
  });
}
