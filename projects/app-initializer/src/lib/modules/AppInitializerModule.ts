import {APP_INITIALIZER as ANGULAR_APP_INITIALIZER, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {IInitializableType} from '../models/IInitializableType';
import {initializeAppAsync} from '../internal/initializeAppAsync';
import {INITIALIZABLE_TYPES} from '../internal/InitializableTypes';
import {AppInitializer} from '../internal/AppInitializer';
import {APP_INITIALIZER_ERROR_LISTENER} from '../internal/AppInitializerErrorListener';
import {AppInitializerEmptyErrorListener} from '../internal/AppInitializerEmptyErrorListener';

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
                        errorListener?: Type<IAppInitializerErrorListener>): ModuleWithProviders<AppInitializerModule> {
    return {
      ngModule: AppInitializerModule,
      providers: [
        {provide: INITIALIZABLE_TYPES, useValue: types},
        {provide: APP_INITIALIZER, useClass: AppInitializer},
        {provide: APP_INITIALIZER_ERROR_LISTENER, useClass: errorListener || AppInitializerEmptyErrorListener}
      ]
    };
  }
}
