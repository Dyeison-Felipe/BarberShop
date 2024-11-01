export interface StorageRequestService {
  run(store: Map<string, unknown>, callback: () => unknown): unknown;

  set(key: string, value: unknown): void;

  get<T>(key: string): T | null;
}
