import {ActivatedRoute, Params} from '@angular/router';
import {Argument, TypeConstructor} from 'flipss-common-types';
import {IComponentRouter} from '../models/IComponentRouter';

export abstract class RoutableComponent {
  protected constructor(private readonly componentRouter: IComponentRouter,
                        private readonly activatedRoute: ActivatedRoute) {
    Argument.isNotNullOrUndefined(componentRouter, 'componentRouter');
    Argument.isNotNullOrUndefined(activatedRoute, 'activatedRoute');

    this.activatedRoute.params.subscribe((p) => this.onShowAsync(p, this.activatedRoute.snapshot.queryParams));
  }

  protected onShowAsync(params?: Params, queryParams?: Params): Promise<void> {
    return Promise.resolve();
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
