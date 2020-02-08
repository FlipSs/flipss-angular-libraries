import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {Argument} from 'flipss-common-types';
import {IDynamicComponentFactoryProvider} from '../models/IDynamicComponentFactoryProvider';
import {IDynamicComponentFactory} from '../models/IDynamicComponentFactory';
import {DynamicComponentFactory} from '../internal/DynamicComponentFactory';

@Injectable()
export class DynamicComponentFactoryProvider implements IDynamicComponentFactoryProvider {
  public constructor(private readonly _componentFactoryResolver: ComponentFactoryResolver) {
    Argument.isNotNullOrUndefined(this._componentFactoryResolver, 'componentFactoryResolver');
  }

  public get(container: ViewContainerRef): IDynamicComponentFactory {
    Argument.isNotNullOrUndefined(container, 'container');

    container.clear();

    return new DynamicComponentFactory(container, this._componentFactoryResolver);
  }
}
