import {InjectionToken} from '@angular/core';

export interface ILoadingService {
  showUntil(promise: Promise<any>): void;
}

export const LOADING_SERVICE = new InjectionToken<ILoadingService>('ILoadingService');
