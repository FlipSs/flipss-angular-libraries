import {IInitializable} from './IInitializable';

export interface IAppInitializerErrorListener {
  onInitializationError(error: Error | string, source: IInitializable): void;
}
