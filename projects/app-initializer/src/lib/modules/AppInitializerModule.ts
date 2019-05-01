import {APP_INITIALIZER as ANGULAR_APP_INITIALIZER, ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {INITIALIZABLE_TYPES} from '../internal/InitializableTypes';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {AppInitializer} from '../services/AppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {APP_INITIALIZER_ERROR_LISTENER} from '../internal/AppInitializerErrorListener';
import {IInitializableType} from '../models/IInitializableType';
import {initializeAppAsync} from '../internal/initializeAppAsync';

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
                        appInitializer?: Type<AppInitializer>): ModuleWithProviders<AppInitializerModule> {
    const providers: Provider[] = [
      {provide: INITIALIZABLE_TYPES, useValue: types},
      {provide: APP_INITIALIZER, useClass: appInitializer || AppInitializer}
    ];

    if (errorListener) {
      providers.push({provide: APP_INITIALIZER_ERROR_LISTENER, useClass: errorListener});
    }

    return {
      ngModule: AppInitializerModule,
      providers
    };
  }
}
