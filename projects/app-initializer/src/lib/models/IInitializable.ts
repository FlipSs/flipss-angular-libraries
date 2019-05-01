export interface IInitializable {
  initializeAsync(): Promise<void>;
}
