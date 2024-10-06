export type BuildModule = {
  controllers: unknown[];
};

export interface IModule {
  buildModule(): BuildModule;
}
