import {AlertComponent} from '../components/AlertComponent';
import {InjectionToken} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';

export interface IAlertService {
  hasShown(): boolean;

  show<T extends AlertComponent<TData, any>, TData>(component: ComponentType<T>, data?: TData): T;
}

export const ALERT_SERVICE = new InjectionToken<IAlertService>('IAlertService');
