import {InjectionToken} from '@angular/core';
import {IInitializableType} from '../models/IInitializableType';

export const INITIALIZABLE_TYPES = new InjectionToken<IInitializableType[]>('IInitializableType[]');
