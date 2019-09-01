import {IComponentRoute} from './IComponentRoute';
import {Params, Route} from '@angular/router';
import {Argument, Set, TypeUtils} from 'flipss-common-types';

export class ComponentRoute implements IComponentRoute {
  private readonly routeCommands: string[];
  private readonly parentRouteCommands: string[];

  public constructor(route: Route,
                     parentRouteCommands?: string[]) {
    Argument.isNotNullOrUndefined(route, 'route');

    this.routeCommands = route.path.split('/');
    this.parentRouteCommands = parentRouteCommands || [];
  }

  public getRouteCommands(routeParams?: Params): string[] {
    let commands = this.routeCommands;
    if (!TypeUtils.isNullOrUndefined(routeParams)) {
      const replacedCommandIndices = new Set<number>();
      Object.keys(routeParams).forEach(p => {
        commands = commands.map((c, i) => {
          if (!replacedCommandIndices.has(i) && c === `:${p}`) {
            replacedCommandIndices.tryAdd(i);

            return routeParams[p];
          }

          return c;
        });
      });
    }

    return [...this.parentRouteCommands, ...commands];
  }
}
