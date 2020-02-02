import {APP_INITIALIZER as ANGULAR_APP_INITIALIZER, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {IInitializableInjectionToken} from '../models/IInitializableInjectionToken';
import {initializeAppAsync} from '../internal/initializeAppAsync';
import {AppInitializer} from '../internal/AppInitializer';
import {AppInitializerEmptyErrorListener} from '../internal/AppInitializerEmptyErrorListener';
import {APP_INITIALIZER_ERROR_LISTENER, INITIALIZABLE_TOKENS} from "../internal/tokens";

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

  public static forRoot(tokens: IInitializableInjectionToken[],
                        errorListenerType?: Type<IAppInitializerErrorListener>): ModuleWithProviders<AppInitializerModule> {
    return {
      ngModule: AppInitializerModule,
      providers: [
        {provide: INITIALIZABLE_TOKENS, useValue: tokens},
        {provide: APP_INITIALIZER, useClass: AppInitializer},
        {
          provide: APP_INITIALIZER_ERROR_LISTENER,
          useClass: errorListenerType || AppInitializerEmptyErrorListener
        }
      ]
    };
  }
}
