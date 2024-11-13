import { Request } from 'express';
import { Middleware } from '../../modules/module.js';

// Arquivo de implementação dos decorators utilizados no sistema
// Contém decorators voltados para requisições web

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const routes: {
  [key: string]: {
    method: string;
    path: string;
    handler: Function;
    bodyClass?: Object;
  }[];
} = {};

const requestMapping = (path: string, method: string) => {
  return function (target: any, propertyKey: string) {
    const formattedPath = formatPath(path);
    if (!routes[target.constructor.name]) {
      routes[target.constructor.name] = [];
    }
    routes[target.constructor.name].push({
      method: method,
      path: formattedPath,
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
    const formattedPrefix = formatPath(prefix);
    target.prototype.prefix = formattedPrefix;
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

// Decorator @Body() para capturar o corpo da requisição
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

// Decorator @Valid() para capturar o corpo da requisição
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
