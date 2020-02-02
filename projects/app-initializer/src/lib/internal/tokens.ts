import {InjectionToken} from "@angular/core";
import {IInitializableInjectionToken} from "../models/IInitializableInjectionToken";
import {IAppInitializerErrorListener} from "../models/IAppInitializerErrorListener";

export const INITIALIZABLE_TOKENS = new InjectionToken<IInitializableInjectionToken[]>('IInitializableInjectionToken[]');
export const APP_INITIALIZER_ERROR_LISTENER = new InjectionToken<IAppInitializerErrorListener>('IAppInitializerErrorListener');
