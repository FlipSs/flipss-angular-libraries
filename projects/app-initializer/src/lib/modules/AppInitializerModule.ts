import {APP_INITIALIZER as ANGULAR_APP_INITIALIZER, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {IInitializableType} from '../models/IInitializableType';
import {initializeAppAsync} from '../internal/initializeAppAsync';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';
import {getProviders} from '../internal/getProviders';

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
    return {
      ngModule: AppInitializerModule,
      providers: getProviders(types, errorListener, stageListeners)
    };
  }
}
