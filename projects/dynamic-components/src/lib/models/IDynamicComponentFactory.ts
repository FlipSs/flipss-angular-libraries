import {IDynamicComponentMetadata} from './IDynamicComponentMetadata';
import {NgModuleRef} from "@angular/core";

export interface IDynamicComponentFactory {
  createAsync<TComponent>(metadata: IDynamicComponentMetadata<TComponent>, moduleRef?: NgModuleRef<any>): Promise<TComponent>;
}
