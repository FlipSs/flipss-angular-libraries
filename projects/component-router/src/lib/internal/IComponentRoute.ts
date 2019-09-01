import {Params} from '@angular/router';

export interface IComponentRoute {
  getRouteCommands(routeParams?: Params): string[];
}
