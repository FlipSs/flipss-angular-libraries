import {Injectable, InjectionToken, Type} from '@angular/core';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {IInitializable} from '../models/IInitializable';

@Injectable()
export class AppInitializerEmptyErrorListener implements IAppInitializerErrorListener {
  public onAppInitializationError(error: Error | string, stage?: AppInitializationStage): void {
  }

  public onTypeInitializationError(error: Error | string, type: Type<IInitializable> | InjectionToken<IInitializable>): void {
  }
}
