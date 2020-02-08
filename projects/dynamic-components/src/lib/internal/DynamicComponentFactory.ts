import {ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {Argument} from 'flipss-common-types';
import {IDynamicComponentMetadata} from '../models/IDynamicComponentMetadata';
import {IDynamicComponentFactory} from '../models/IDynamicComponentFactory';

export class DynamicComponentFactory implements IDynamicComponentFactory {
  public constructor(private readonly _container: ViewContainerRef,
                     private readonly _componentFactoryResolver: ComponentFactoryResolver) {
  }

  public async createAsync<TComponent>(metadata: IDynamicComponentMetadata<TComponent>): Promise<TComponent> {
    Argument.isNotNullOrUndefined(metadata, 'metadata');

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(metadata.componentType);
    const componentInstance = this._container.createComponent(componentFactory).instance;

    await metadata.initializeComponentAsync(componentInstance);

    return componentInstance;
  }
}
