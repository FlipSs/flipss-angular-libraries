import {Injectable, NgZone} from '@angular/core';
import {Params, RouteConfigLoadEnd, Router, Routes} from '@angular/router';
import {IComponentRouter} from '../models/IComponentRouter';
import {IComponentRoute} from '../internal/IComponentRoute';
import {ComponentRoute} from '../internal/ComponentRoute';
import {Argument, Dictionary, IReadOnlyDictionary, TypeConstructor, TypeUtils} from 'flipss-common-types';

@Injectable()
export class ComponentRouter implements IComponentRouter {
  private _routes: IReadOnlyDictionary<TypeConstructor<any>, IComponentRoute>;

  public constructor(private readonly _router: Router,
                     private readonly _ngZone: NgZone) {
    Argument.isNotNullOrUndefined(this._router, 'router');
    Argument.isNotNullOrUndefined(this._ngZone, 'ngZone');

    this.updateRoutes();
    this._router.events.subscribe(event => {
      if (TypeUtils.is(event, RouteConfigLoadEnd)) {
        this.updateRoutes();
      }
    });
  }

  private static getRoutes(routes: Routes,
                           parentRoutePaths: string[] = []): IReadOnlyDictionary<TypeConstructor<any>, IComponentRoute> {
    const result = new Dictionary<TypeConstructor<any>, IComponentRoute>();

    if (TypeUtils.isNullOrUndefined(routes)) {
      return result;
    }

    for (const route of routes) {
      if (TypeUtils.isNullOrUndefined(route.path) || TypeUtils.isNullOrUndefined(route.component)) {
        continue;
      }

      result.set(route.component, new ComponentRoute(route, parentRoutePaths));

      if (!TypeUtils.isNullOrUndefined(route.children) && route.children.length > 0) {
        const childRoutes = ComponentRouter.getRoutes(route.children, [...parentRoutePaths, route.path]);

        for (const childRoute of childRoutes) {
          result.set(childRoute.key, childRoute.value);
        }
      }
    }

    return result;
  }

  public navigateToAsync(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): Promise<boolean> {
    Argument.isNotNullOrUndefined(target, 'target');

    const url = this.getUrl(target, routeParams, queryParams);

    return this.navigateInternalAsync(url);
  }

  public getUrlFor(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): string {
    Argument.isNotNullOrUndefined(target, 'target');

    return this.getUrl(target, routeParams, queryParams);
  }

  public navigateAsync(url: string): Promise<boolean> {
    Argument.isNotNullOrUndefined(url, 'url');

    return this.navigateInternalAsync(url);
  }

  private navigateInternalAsync(url: string): Promise<boolean> {
    return this._ngZone.run(() => this._router.navigateByUrl(url));
  }

  private getUrl(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): string {
    this.ensureTargetIsRegistered(target);

    const route = this._routes.get(target);

    return this._router.createUrlTree(route.getRouteCommands(routeParams), {
      queryParams
    }).toString();
  }

  private ensureTargetIsRegistered(target: TypeConstructor<any>): void {
    if (!this._routes.containsKey(target)) {
      throw new Error(`Route for component: ${target.name} is not registered`);
    }
  }

  private updateRoutes(): void {
    this._routes = ComponentRouter.getRoutes(this._router.config);
  }
}
