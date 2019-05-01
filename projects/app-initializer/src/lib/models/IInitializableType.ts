import {AppInitializationStage} from './AppInitializationStage';
import {InjectionToken, Type} from '@angular/core';
import {IInitializable} from './IInitializable';

export interface IInitializableType {
  readonly type: Type<IInitializable> | InjectionToken<IInitializable>;
  readonly initializationStage: AppInitializationStage;
}

