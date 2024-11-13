// Arquivo de implementação dos decorators utilizados no sistema
// Contém decorators voltados para o tratamento dos parâmetros das requisições web

// Decorator @Query() para query params
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

// Decorator @Param() para obter os parâmetros da URL
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
