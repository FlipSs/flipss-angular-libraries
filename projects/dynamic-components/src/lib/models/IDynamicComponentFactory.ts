import {IDynamicComponentMetadata} from './IDynamicComponentMetadata';

export interface IDynamicComponentFactory {
  createAsync<TComponent>(metadata: IDynamicComponentMetadata<TComponent>): Promise<TComponent>;
}
