import {IAppInitializer} from '../models/IAppInitializer';

export function initializeAppAsync(appInitializer: IAppInitializer): Promise<void> {
  return appInitializer.initializeAppAsync();
}
