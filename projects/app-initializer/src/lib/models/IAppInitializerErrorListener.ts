import {AppInitializationStage} from './AppInitializationStage';
import {InjectionToken, Type} from '@angular/core';
import {IInitializable} from './IInitializable';

export interface IAppInitializerErrorListener {
  onTypeInitializationError(error: Error | string, type: Type<IInitializable> | InjectionToken<IInitializable>): void;

  onAppInitializationError(error: Error | string, stage?: AppInitializationStage): void;
}
