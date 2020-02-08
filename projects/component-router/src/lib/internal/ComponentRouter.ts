import {Inject, Injectable, InjectionToken, NgZone} from '@angular/core';
import {Params, Router} from '@angular/router';
import {ComponentParams, IComponentRouter} from '../models/IComponentRouter';
import {IComponentRoute} from './IComponentRoute';
import {ComponentRoute} from './ComponentRoute';
import {Argument, Dictionary, IDictionary, IReadOnlyDictionary, TypeUtils} from 'flipss-common-types';
import {IComponentRouteMetadata} from "../models/IComponentRouteMetadata";
import {IComponentKey} from "../models/IComponentKey";

@Injectable()
export class ComponentRouter implements IComponentRouter {
  private readonly _routes!: IReadOnlyDictionary<IComponentKey<any>, IComponentRoute>;

  public constructor(@Inject(CONFIGURATION) configuration: IComponentRouteMetadata[],
                     private readonly _router: Router,
                     private readonly _ngZone: NgZone) {
    Argument.isNotNullOrUndefined(configuration, 'configuration');
    Argument.isNotNullOrUndefined(this._router, 'router');
    Argument.isNotNullOrUndefined(this._ngZone, 'ngZone');

    const routes = new Dictionary<IComponentKey<any>, IComponentRoute>();
    ComponentRouter.setUpRoutes(configuration, routes);

    this._routes = routes;
  }

  private static setUpRoutes(metadataCollection: ReadonlyArray<IComponentRouteMetadata>,
                             routes: IDictionary<IComponentKey<any>, IComponentRoute>,
                             parentRoutePaths: string[] = []): void {
    for (const metadata of metadataCollection) {
      routes.set(metadata.key, new ComponentRoute(metadata.key, parentRoutePaths));

      if (!TypeUtils.isNullOrUndefined(metadata.children) && metadata.children.length > 0) {
        ComponentRouter.setUpRoutes(metadata.children, routes, [...parentRoutePaths, metadata.key.path]);
      }
    }
  }

  public navigateToAsync<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: Params): Promise<boolean> {
    Argument.isNotNullOrUndefined(target, 'target');

    const url = this.getUrl(target, routeParams, queryParams);

    return this.navigateInternalAsync(url);
  }

  public getUrlFor<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: Params): string {
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

  private getUrl(target: IComponentKey<any>, routeParams?: any, queryParams?: Params): string {
    this.ensureTargetIsRegistered(target);

    const route = this._routes.get(target);

    return this._router.createUrlTree(route.getRouteCommands(routeParams), {
      queryParams
    }).toString();
  }

  private ensureTargetIsRegistered(target: IComponentKey<any>): void {
    if (!this._routes.containsKey(target)) {
      throw new Error(`Route for ${target.name} is not registered`);
    }
  }
}

export const CONFIGURATION = new InjectionToken<IComponentRouteMetadata[]>('Configuration');
