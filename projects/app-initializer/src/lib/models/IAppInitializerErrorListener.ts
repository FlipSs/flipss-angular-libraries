import {AppInitializationStage} from './AppInitializationStage';
import {InjectionToken, Type} from '@angular/core';
import {IInitializable} from './IInitializable';

export interface IAppInitializerErrorListener {
  onTypeInitializationError(error: Error, type: Type<IInitializable> | InjectionToken<IInitializable>): void;

  onAppInitializationError(error: Error, stage?: AppInitializationStage): void;
}
