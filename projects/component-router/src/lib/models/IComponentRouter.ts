import {InjectionToken} from '@angular/core';
import {Component} from '../types/Component';

export interface IComponentRouter {
  navigateToAsync(target: Component<any>, args?: string[]): Promise<boolean>;
}

export const COMPONENT_ROUTER = new InjectionToken<IComponentRouter>('IComponentRouter');
