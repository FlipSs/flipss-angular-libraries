import {InjectionToken, ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {COMPONENT_ROUTER_LOGGER, ComponentRouter, CONFIGURATION} from '../internal/ComponentRouter';
import {COMPONENT_ROUTER} from '../models/IComponentRouter';
import {IComponentRouteMetadata} from "../models/IComponentRouteMetadata";
import {ILogger, TypeUtils} from "flipss-common-types";

@NgModule()
export class ComponentRouterModule {
  public static forRoot(metadataCollection: IComponentRouteMetadata[], logger?: InjectionToken<ILogger> | Type<ILogger>): ModuleWithProviders<ComponentRouterModule> {
    const providers: Provider[] = [
      {
        provide: CONFIGURATION,
        useValue: metadataCollection
      },
      {
        provide: COMPONENT_ROUTER,
        useClass: ComponentRouter
      }
    ];

    if (!TypeUtils.isNullOrUndefined(logger)) {
      providers.push({
        provide: COMPONENT_ROUTER_LOGGER,
        useExisting: logger
      });
    }

    return {
      ngModule: ComponentRouterModule,
      providers
    };
  }
}
