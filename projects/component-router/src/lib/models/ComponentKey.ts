import {IComponentKey} from "./IComponentKey";

export class ComponentKey<TParams> implements IComponentKey<TParams> {
  public constructor(private readonly _path: string,
                     private readonly _name: string) {
  }

  public get path(): string {
    return this._path;
  }

  public get name(): string {
    return this._name;
  }
}
