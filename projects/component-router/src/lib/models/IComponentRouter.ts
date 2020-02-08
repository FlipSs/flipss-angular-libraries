import {InjectionToken} from '@angular/core';
import {Params} from '@angular/router';
import {IComponentKey} from "./IComponentKey";

export interface IComponentRouter {
  getUrlFor<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: Params): string;

  navigateToAsync<TParams>(target: IComponentKey<TParams>, routeParams?: ComponentParams<TParams>, queryParams?: Params): Promise<boolean>;

  navigateAsync(url: string): Promise<boolean>;
}

export type ComponentParams<T> = { [K in keyof T]: T[K] extends string ? T[K] : never };

export const COMPONENT_ROUTER = new InjectionToken<IComponentRouter>('IComponentRouter');
