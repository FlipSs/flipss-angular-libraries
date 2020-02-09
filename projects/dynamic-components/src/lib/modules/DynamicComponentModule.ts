import {ModuleWithProviders, NgModule} from "@angular/core";
import {DYNAMIC_COMPONENT_FACTORY_PROVIDER} from "../models/IDynamicComponentFactoryProvider";
import {DynamicComponentFactoryProvider} from "../services/DynamicComponentFactoryProvider";

@NgModule()
export class DynamicComponentModule {
  public static forRoot(): ModuleWithProviders<DynamicComponentModule> {
    return {
      ngModule: DynamicComponentModule,
      providers: [
        {
          provide: DYNAMIC_COMPONENT_FACTORY_PROVIDER,
          useClass: DynamicComponentFactoryProvider
        }
      ]
    };
  }
}
