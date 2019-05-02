import {InjectionToken} from '@angular/core';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';

export const APP_INITIALIZATION_STAGE_LISTENER = new InjectionToken<IAppInitializationStageListener[]>('IAppInitializationStageListener[]');
