import {Provider, Type} from '@angular/core';
import {IInitializableType} from '../models/IInitializableType';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';
import {INITIALIZABLE_TYPES} from './InitializableTypes';
import {APP_INITIALIZER_ERROR_LISTENER} from './AppInitializerErrorListener';
import {AppInitializer} from './AppInitializer';
import {AppInitializerEmptyErrorListener} from './AppInitializerEmptyErrorListener';
import {APP_INITIALIZATION_STAGE_LISTENER} from './AppInitializationStageListener';
import {APP_INITIALIZER} from '../models/IAppInitializer';

export function getProviders(types: IInitializableType[],
                             errorListener?: Type<IAppInitializerErrorListener>,
                             stageListeners?: Type<IAppInitializationStageListener>[]): Provider[] {
  const providers: Provider[] = [
    {provide: INITIALIZABLE_TYPES, useValue: types},
    {provide: APP_INITIALIZER, useClass: AppInitializer},
    {provide: APP_INITIALIZER_ERROR_LISTENER, useClass: errorListener || AppInitializerEmptyErrorListener}
  ];

  if (stageListeners && stageListeners.length > 0) {
    for (const listener of stageListeners) {
      providers.push({
        provide: APP_INITIALIZATION_STAGE_LISTENER,
        useClass: listener,
        multi: true
      });
    }
  }

  return providers;
}
