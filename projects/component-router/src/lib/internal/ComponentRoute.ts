import {IComponentRoute} from './IComponentRoute';
import {Argument, TypeUtils} from 'flipss-common-types';
import {IComponentKey} from "../models/IComponentKey";
import {ComponentParams} from "../models/IComponentRouter";

export class ComponentRoute implements IComponentRoute {
  private readonly _routeCommands: string[];
  private readonly _parentRouteCommands: string[];

  public constructor(key: IComponentKey<any>,
                     parentRouteCommands?: string[]) {
    Argument.isNotNullOrUndefined(key, 'key');

    this._routeCommands = key.path.split('/').filter(p => p.length > 0);
    this._parentRouteCommands = parentRouteCommands || [];
  }

  public getRouteCommands(routeParams?: ComponentParams<any>): string[] {
    let commands = this._routeCommands;
    if (!TypeUtils.isNullOrUndefined(routeParams)) {
      for (const key of Object.keys(routeParams)) {
        commands = commands.map(command => {
          if (command === `:${key}`) {
            return routeParams[key];
          }

          return command;
        });
      }
    }

    return [...this._parentRouteCommands, ...commands];
  }
}
