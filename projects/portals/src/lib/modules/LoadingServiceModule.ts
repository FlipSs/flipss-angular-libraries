import {ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {PortalModule} from '@angular/cdk/portal';
import {LoadingService} from '../services/LoadingService';
import {LOADING_SERVICE} from '../models/ILoadingService';

@NgModule({
  imports: [
    PortalModule
  ]
})
export class LoadingServiceModule {
  public static forRoot<T>(service: Type<LoadingService<T>>,
                           component: Type<T>): ModuleWithProviders<LoadingServiceModule> {
    return {
      ngModule: LoadingServiceModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: component,
          multi: true
        },
        {
          provide: LOADING_SERVICE,
          useClass: service
        }
      ]
    };
  }
}
