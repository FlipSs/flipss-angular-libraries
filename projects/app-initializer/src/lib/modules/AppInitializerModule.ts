import {APP_INITIALIZER as ANGULAR_APP_INITIALIZER, ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {INITIALIZABLE_TYPES} from '../internal/InitializableTypes';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {AppInitializer} from '../internal/AppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {APP_INITIALIZER_ERROR_LISTENER} from '../internal/AppInitializerErrorListener';
import {IInitializableType} from '../models/IInitializableType';
import {initializeAppAsync} from '../internal/initializeAppAsync';
import {AppInitializerEmptyErrorListener} from '../internal/AppInitializerEmptyErrorListener';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';
import {APP_INITIALIZATION_STAGE_LISTENER} from '../internal/AppInitializationStageListener';

@NgModule({
  providers: [
    {
      provide: ANGULAR_APP_INITIALIZER,
      useFactory: initializeAppAsync,
      deps: [APP_INITIALIZER],
      multi: true
    }
  ]
})
export class AppInitializerModule {
  public static forRootCustom(appInitializer: Type<IAppInitializer>): ModuleWithProviders<AppInitializerModule> {
    return {
      ngModule: AppInitializerModule,
      providers: [
        {provide: APP_INITIALIZER, useClass: appInitializer}
      ]
    };
  }

  public static forRoot(types: IInitializableType[],
                        errorListener?: Type<IAppInitializerErrorListener>,
                        stageListeners?: Type<IAppInitializationStageListener>[]): ModuleWithProviders<AppInitializerModule> {
    const providers: Provider[] = [
      {provide: INITIALIZABLE_TYPES, useValue: types},
      {provide: APP_INITIALIZER, useClass: AppInitializer},
      {provide: APP_INITIALIZER_ERROR_LISTENER, useClass: errorListener || AppInitializerEmptyErrorListener}
    ];

    if (stageListeners && stageListeners.length > 0) {
      providers.push(stageListeners.map<Provider>(l => {
        return {
          provide: APP_INITIALIZATION_STAGE_LISTENER,
          useClass: l,
          multi: true
        };
      }));
    }

    return {
      ngModule: AppInitializerModule,
      providers
    };
  }
}
