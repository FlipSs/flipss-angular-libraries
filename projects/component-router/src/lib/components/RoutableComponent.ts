import {Params} from '@angular/router';
import {Argument, TypeConstructor} from 'flipss-common-types';
import {IComponentRouter} from '../models/IComponentRouter';

export abstract class RoutableComponent {
  protected constructor(private readonly _componentRouter: IComponentRouter) {
    Argument.isNotNullOrUndefined(this._componentRouter, 'componentRouter');
  }

  protected getUrl(routeParams?: Params, queryParams?: Params): string {
    return this._componentRouter.getUrlFor(this.constructor, routeParams, queryParams);
  }

  protected getUrlFor(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): string {
    return this._componentRouter.getUrlFor(target, routeParams, queryParams);
  }

  protected navigateToAsync(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): Promise<boolean> {
    return this._componentRouter.navigateToAsync(target, routeParams, queryParams);
  }

  protected navigateAsync(url: string): Promise<boolean> {
    return this._componentRouter.navigateAsync(url);
  }
}
