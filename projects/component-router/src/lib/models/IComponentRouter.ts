import {InjectionToken} from '@angular/core';
import {TypeConstructor} from 'flipss-common-types';
import {Params} from '@angular/router';

export interface IComponentRouter {
  getUrlFor(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): string;

  navigateToAsync(target: TypeConstructor<any>, routeParams?: Params, queryParams?: Params): Promise<boolean>;
}

export const COMPONENT_ROUTER = new InjectionToken<IComponentRouter>('IComponentRouter');
