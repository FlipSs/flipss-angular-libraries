import {Inject, Injectable, InjectionToken, NgZone, Optional} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentParams, IComponentRouter, IQueryParams} from '../models/IComponentRouter';
import {IComponentRoute} from './IComponentRoute';
import {ComponentRoute} from './ComponentRoute';
import {Argument, Dictionary, Func, IDictionary, ILogger, IReadOnlyDictionary, TypeUtils} from 'flipss-common-types';
import {IComponentRouteMetadata} from "../models/IComponentRouteMetadata";
import {IComponentKey} from "../models/IComponentKey";

@Injectable()
export class ComponentRouter implements IComponentRouter {
  private readonly _routes!: IReadOnlyDictionary<IComponentKey<any>, IComponentRoute>;

  public constructor(@Inject(CONFIGURATION) configuration: IComponentRouteMetadata[],
                     private readonly _router: Router,
                     private readonly _ngZone: NgZone,
                     @Inject(COMPONENT_ROUTER_LOGGER) @Optional() private readonly _logger?: ILogger) {
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

  private static getUrlPath(url: string): string {
    return url?.split('?')[0];
  }

  public navigateToAsync<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: IQueryParams): Promise<void> {
    Argument.isNotNullOrUndefined(target, 'target');

    const url = this.getUrl(target, routeParams, queryParams);

    return this.navigateInternalAsync('navigateToAsync', url);
  }

  public getUrlFor<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: IQueryParams): string {
    Argument.isNotNullOrUndefined(target, 'target');

    return this.getUrl(target, routeParams, queryParams);
  }

  public navigateAsync(url: string): Promise<void> {
    Argument.isNotNullOrUndefined(url, 'url');

    return this.navigateInternalAsync('navigateAsync', url);
  }

  public setQueryParamsAsync(currentRoute: ActivatedRoute, queryParams: IQueryParams): Promise<void> {
    Argument.isNotNullOrUndefined(currentRoute, 'currentRoute');
    Argument.isNotNullOrUndefined(queryParams, 'queryParams');

    return this.executeRouterActionAsync(r => r.navigate([], {
      relativeTo: currentRoute,
      queryParams: queryParams.value,
      queryParamsHandling: queryParams.handling
    }), 'setQueryParams');
  }

  public isCurrentUrl(url: string): boolean {
    return ComponentRouter.getUrlPath(url) === ComponentRouter.getUrlPath(this._router.url);
  }

  public isCurrentComponent<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>): boolean {
    return this.isCurrentUrl(this.getUrlFor(target, routeParams));
  }

  private navigateInternalAsync(actionName: string, url: string): Promise<void> {
    return this.executeRouterActionAsync(r => r.navigateByUrl(url), actionName, url);
  }

  private async executeRouterActionAsync(action: Func<Promise<boolean>, Router>, actionName: string, url?: string): Promise<void> {
    const isExecuted = await this._ngZone.run(() => action(this._router));
    if (!isExecuted) {
      this._logger?.warn('Failed to execute action', 'ComponentRouter', {
        actionName,
        url
      });
    }
  }

  private getUrl(target: IComponentKey<any>, routeParams?: any, queryParams?: IQueryParams): string {
    this.ensureTargetIsRegistered(target);

    const route = this._routes.get(target);

    return this._router.createUrlTree(route.getRouteCommands(routeParams), {
      queryParams: queryParams && queryParams.value,
      queryParamsHandling: queryParams && queryParams.handling
    }).toString();
  }

  private ensureTargetIsRegistered(target: IComponentKey<any>): void {
    if (!this._routes.containsKey(target)) {
      throw new Error(`Route for ${target.name} is not registered`);
    }
  }
}

export const CONFIGURATION = new InjectionToken<IComponentRouteMetadata[]>('Configuration');
export const COMPONENT_ROUTER_LOGGER = new InjectionToken<ILogger>('ComponentRouterLogger');
