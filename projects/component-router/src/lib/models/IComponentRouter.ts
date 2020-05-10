import {InjectionToken} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling} from '@angular/router';
import {IComponentKey} from "./IComponentKey";

export interface IComponentRouter {
  isCurrentUrl(url: string): boolean;

  isCurrentComponent<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>): boolean;

  getUrlFor<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: IQueryParams): string;

  navigateToAsync<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: IQueryParams): Promise<void>;

  navigateAsync(url: string): Promise<void>;

  setQueryParamsAsync(currentRoute: ActivatedRoute, queryParams: IQueryParams): Promise<void>;
}

export type ComponentParams<T> = { [K in keyof T]: T[K] extends string ? T[K] : never };

export interface IQueryParams {
  readonly value: Params;
  readonly handling?: QueryParamsHandling;
}

export const COMPONENT_ROUTER = new InjectionToken<IComponentRouter>('IComponentRouter');
