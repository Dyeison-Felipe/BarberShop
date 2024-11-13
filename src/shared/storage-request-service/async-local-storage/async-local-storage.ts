import { AsyncLocalStorage } from 'async_hooks';

// Implementação do padrão Singleton
// Instância única usada na aplicação toda
export const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();
