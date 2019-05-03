import {InjectionToken} from '@angular/core';

export interface ILoadingService {
  showUntil(promise: Promise<void>): Promise<void>;
}

export const LOADING_SERVICE = new InjectionToken<ILoadingService>('ILoadingService');
