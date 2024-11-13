import { Request } from 'express';

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
