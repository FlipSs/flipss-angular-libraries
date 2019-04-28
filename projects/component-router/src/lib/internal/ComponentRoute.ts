import {IComponentRoute} from './IComponentRoute';
import {Route} from '@angular/router';
import {IRoutePathData} from '../models/IRoutePathData';
import {Argument} from 'flipss-common-types/utils';
import {Func} from 'flipss-common-types/types';

export class ComponentRoute implements IComponentRoute {
  private readonly getRoutePathCommands: Func<string[], string[]>;

  public constructor(route: Route,
                     private readonly parentUrlParts: string[] = []) {
    Argument.isNotNullOrUndefined(route, 'Route');
    Argument.isNotNullOrUndefined(parentUrlParts, 'ParentUrlParts');

    const routePathData = route.data as IRoutePathData;
    this.getRoutePathCommands = routePathData
      ? (args) => routePathData.getPathCommands(args)
      : () => [route.path];
  }

  public getRouteCommands(args?: string[]): string[] {
    const routePathCommands = this.getRoutePathCommands(args);

    return this.parentUrlParts.concat(routePathCommands);
  }
}
