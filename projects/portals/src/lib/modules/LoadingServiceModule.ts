import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {LoadingService} from '../services/LoadingService';
import {LOADING_SERVICE} from '../models/ILoadingService';
import {PortalModule} from "@angular/cdk/portal";

@NgModule({
  imports: [
    PortalModule
  ]
})
export class LoadingServiceModule {
  public static forRoot<T>(serviceType: Type<LoadingService<T>>): ModuleWithProviders<LoadingServiceModule> {
    return {
      ngModule: LoadingServiceModule,
      providers: [
        {
          provide: LOADING_SERVICE,
          useClass: serviceType
        }
      ]
    };
  }
}
