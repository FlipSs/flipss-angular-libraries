import {AppInitializationStage} from './AppInitializationStage';

export interface IAppInitializationStageListener {
  readonly stage: AppInitializationStage;

  beforeInitializationAsync(typeCount: number): Promise<void>;

  onTypeInitializedAsync(): Promise<void>;

  afterInitializationAsync(): Promise<void>;
}

