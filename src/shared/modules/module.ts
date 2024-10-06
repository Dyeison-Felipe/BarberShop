export type BuildModule = {
  controllers: Object[];
};

export interface IModule {
  buildModule(): BuildModule;
}
