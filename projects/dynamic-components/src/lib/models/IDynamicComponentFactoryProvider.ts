import {InjectionToken, ViewContainerRef} from '@angular/core';
import {IDynamicComponentFactory} from './IDynamicComponentFactory';

export interface IDynamicComponentFactoryProvider {
  get(container: ViewContainerRef): IDynamicComponentFactory;
}

export const DYNAMIC_COMPONENT_FACTORY_PROVIDER = new InjectionToken<IDynamicComponentFactoryProvider>('IDynamicComponentFactoryProvider');
