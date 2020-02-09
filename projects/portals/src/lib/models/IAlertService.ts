import {AlertComponent} from '../components/AlertComponent';
import {InjectionToken} from '@angular/core';
import {ComponentType} from '@angular/cdk/overlay';

export interface IAlertService {
  showAsync<T extends AlertComponent<TData, any>, TData>(component: ComponentType<T>, data?: TData): Promise<T>;
}

export const ALERT_SERVICE = new InjectionToken<IAlertService>('IAlertService');
export const ALERT_DATA = new InjectionToken<any>('AlertData');

