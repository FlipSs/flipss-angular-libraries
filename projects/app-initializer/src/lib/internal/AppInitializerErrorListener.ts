import {InjectionToken} from '@angular/core';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';

export const APP_INITIALIZER_ERROR_LISTENER = new InjectionToken<IAppInitializerErrorListener>('IAppInitializerErrorListener');
