import {InjectionToken} from '@angular/core';

export interface IAppInitializer {
  initializeAppAsync(): Promise<void>;
}

export const APP_INITIALIZER = new InjectionToken<IAppInitializer>('IAppInitializer');
