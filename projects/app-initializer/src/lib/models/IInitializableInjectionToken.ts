import {InjectionToken, Type} from '@angular/core';
import {IInitializable} from "./IInitializable";

export interface IInitializableInjectionToken {
  readonly value: Type<IInitializable> | InjectionToken<IInitializable>;
}
