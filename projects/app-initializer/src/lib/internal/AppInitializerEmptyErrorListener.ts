import {Injectable} from '@angular/core';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {IInitializable} from '../models/IInitializable';

@Injectable()
export class AppInitializerEmptyErrorListener implements IAppInitializerErrorListener {
  public onInitializationError(error: Error | string, source: IInitializable): void {
  }
}
