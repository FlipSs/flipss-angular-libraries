import {Params} from '@angular/router';
import {Argument, TypeConstructor} from 'flipss-common-types';
import {IComponentRouter} from '../models/IComponentRouter';

export abstract class RoutableComponent {
  protected constructor(private readonly componentRouter: IComponentRouter) {
    Argument.isNotNullOrUndefined(componentRouter, 'componentRouter');
  }

  protected getUrl(routeParams?: Params, queryParams?: Params): string {
    return this.componentRouter.getUrlFor(this.constructor, routeParams, queryParams);
  }

  protected getUrlFor(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): string {
    return this.componentRouter.getUrlFor(target, routeParams, queryParams);
  }

  protected navigateToAsync(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): Promise<boolean> {
    return this.componentRouter.navigateToAsync(target, routeParams, queryParams);
  }

  protected navigateAsync(url: string): Promise<boolean> {
    return this.componentRouter.navigateAsync(url);
  }
}
