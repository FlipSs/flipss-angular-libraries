import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {ComponentRouter} from '../services/ComponentRouter';
import {COMPONENT_ROUTER, IComponentRouter} from '../models/IComponentRouter';

@NgModule()
export class ComponentRouterModule {
  public static forRoot(customComponentRouter?: Type<IComponentRouter>): ModuleWithProviders<ComponentRouterModule> {
    return {
      ngModule: ComponentRouterModule,
      providers: [
        {provide: COMPONENT_ROUTER, useClass: customComponentRouter || ComponentRouter}
      ]
    };
  }
}
