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
  public static forRoot<T>(serviceType: Type<LoadingService<T>>,
                           componentType: Type<T>): ModuleWithProviders<LoadingServiceModule> {
    return {
      ngModule: LoadingServiceModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: [componentType],
          multi: true
        },
        {
          provide: LOADING_SERVICE,
          useClass: serviceType
        }
      ]
    };
  }
}
