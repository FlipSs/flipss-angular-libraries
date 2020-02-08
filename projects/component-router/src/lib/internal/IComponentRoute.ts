import {ComponentParams} from "../models/IComponentRouter";

export interface IComponentRoute {
  getRouteCommands(routeParams?: ComponentParams<any>): string[];
}
