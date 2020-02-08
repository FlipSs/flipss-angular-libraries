import {Type} from '@angular/core';

export interface IDynamicComponentMetadata<TComponent> {
  readonly componentType: Type<TComponent>,

  initializeComponentAsync(component: TComponent): Promise<void>;
}
