import {IComponentRouteMetadata} from "./IComponentRouteMetadata";
import {IComponentKey} from "./IComponentKey";

export class ComponentRouteMetadata implements IComponentRouteMetadata {
  public constructor(private readonly _key: IComponentKey<any>,
                     private readonly _children?: ReadonlyArray<IComponentRouteMetadata> | null) {
  }

  public get children(): ReadonlyArray<IComponentRouteMetadata> | null {
    return this._children;
  }

  public get key(): IComponentKey<any> {
    return this._key;
  }
}
