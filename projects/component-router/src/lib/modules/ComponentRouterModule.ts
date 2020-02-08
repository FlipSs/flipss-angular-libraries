import {ModuleWithProviders, NgModule} from '@angular/core';
import {ComponentRouter, CONFIGURATION} from '../internal/ComponentRouter';
import {COMPONENT_ROUTER} from '../models/IComponentRouter';
import {IComponentRouteMetadata} from "../models/IComponentRouteMetadata";

@NgModule()
export class ComponentRouterModule {
  public static forRoot(metadataCollection: IComponentRouteMetadata[]): ModuleWithProviders<ComponentRouterModule> {
    return {
      ngModule: ComponentRouterModule,
      providers: [
        {
          provide: CONFIGURATION,
          useValue: metadataCollection
        },
        {
          provide: COMPONENT_ROUTER,
          useClass: ComponentRouter
        }
      ]
    };
  }
}
