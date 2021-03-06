import {IAppInitializer} from '../models/IAppInitializer';
import {Func} from 'flipss-common-types';

export function initializeAppAsync(appInitializer: IAppInitializer): Func<void, Promise<void>> {
  return () => appInitializer.initializeAppAsync();
}
