import {Inject, Injectable, Injector} from '@angular/core';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {Argument} from 'flipss-common-types';
import {IAppInitializer} from '../models/IAppInitializer';
import {IInitializableInjectionToken} from '../models/IInitializableInjectionToken';
import {IInitializable} from '../models/IInitializable';
import {APP_INITIALIZER_ERROR_LISTENER, INITIALIZABLE_TOKENS} from "./tokens";

@Injectable()
export class AppInitializer implements IAppInitializer {
  public constructor(@Inject(INITIALIZABLE_TOKENS) private readonly _tokens: IInitializableInjectionToken[],
                     private readonly _injector: Injector,
                     @Inject(APP_INITIALIZER_ERROR_LISTENER) private readonly _errorListener: IAppInitializerErrorListener) {
    Argument.isNotNullOrUndefined(this._tokens, 'tokens');
    Argument.isNotNullOrUndefined(this._injector, 'injector');
    Argument.isNotNullOrUndefined(this._errorListener, 'errorListener');
  }

  public async initializeAppAsync(): Promise<void> {
    for (const token of this._tokens) {
      await this.initializeByTokenAsync(token);
    }
  }

  private async initializeByTokenAsync(token: IInitializableInjectionToken): Promise<void> {
    let instance: IInitializable;
    try {
      instance = this._injector.get(token.value);
      await instance.initializeAsync();
    } catch (e) {
      this._errorListener.onInitializationError(e, instance);
    }
  }
}
