import {Injectable, NgZone} from '@angular/core';
import {Route, RouteConfigLoadEnd, Router, Routes} from '@angular/router';
import {IComponentRouter} from '../models/IComponentRouter';
import {IComponentRoute} from '../internal/IComponentRoute';
import {ComponentRoute} from '../internal/ComponentRoute';
import {Argument} from 'flipss-common-types/utils';
import {Component} from '../types/Component';

@Injectable()
export class ComponentRouter implements IComponentRouter {
  private routeMap: Map<Component<any>, IComponentRoute>;

  public constructor(private readonly router: Router,
                     private readonly ngZone: NgZone) {
    Argument.isNotNullOrUndefined(router, 'Router');
    Argument.isNotNullOrUndefined(ngZone, 'NgZone');

    this.updateRouteMap();
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.updateRouteMap();
      }
    });
  }

  private static getRouteMap(routes: Routes,
                             parentRoutePaths: string[] = []): Map<Component<any>, IComponentRoute> {
    const result: Map<Component<any>, IComponentRoute> = new Map<Component<any>, IComponentRoute>();

    if (!routes) {
      return result;
    }

    routes.forEach((route: Route) => {
      if (route.path == null || route.component == null) {
        return;
      }

      const urlParts = parentRoutePaths.concat(route.path);

      result.set(route.component, new ComponentRoute(route, parentRoutePaths));

      if (route.children && route.children.length > 0) {
        this.getRouteMap(route.children, urlParts)
          .forEach((v, k) => {
            result.set(k, v);
          });
      }
    });

    return result;
  }

  public navigateToAsync(target: Component<any>, args?: string[]): Promise<boolean> {
    Argument.isNotNullOrUndefined(target, 'TargetComponent');

    if (!this.routeMap.has(target)) {
      throw new Error(`Route for component: ${target.name} is not registered`);
    }

    const route = this.routeMap.get(target);

    return this.ngZone.run(() => {
      const urlCommands = route.getRouteCommands(args);

      return this.router.navigate(urlCommands);
    });
  }

  private updateRouteMap(): void {
    this.routeMap = ComponentRouter.getRouteMap(this.router.config);
  }
}
