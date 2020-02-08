import {IComponentKey} from "./IComponentKey";

export interface IComponentRouteMetadata {
  readonly key: IComponentKey<any>;
  readonly children: ReadonlyArray<IComponentRouteMetadata> | null;
}
