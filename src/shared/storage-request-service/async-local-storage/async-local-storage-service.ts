import { AsyncLocalStorage } from 'async_hooks';
import { StorageRequestService } from '../storage-request-service.js';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();

export class AsyncLocalStorageService implements StorageRequestService {
  run(store: Map<string, unknown>, callback: () => unknown): unknown {
    return asyncLocalStorage.run(store, callback);
  }

  set(key: string, value: unknown): void {
    asyncLocalStorage.getStore()?.set(key, value);
  }

  get<T>(key: string): T | null {
    const store = asyncLocalStorage.getStore()?.get(key) as T | undefined;

    if (!store) return null;

    return store;
  }
}