import {ActivatedRoute} from '@angular/router';
import {Argument} from 'flipss-common-types/utils';
import {IComponentRouter} from '../models/IComponentRouter';
import {Component} from '../types/Component';

export abstract class RoutableComponent {
  protected constructor(private readonly componentRouter: IComponentRouter,
                        private readonly activatedRoute: ActivatedRoute) {
    Argument.isNotNullOrUndefined(componentRouter, 'IComponentRouter');
    Argument.isNotNullOrUndefined(activatedRoute, 'ActivatedRoute');

    this.activatedRoute.params.subscribe((p) => this.onShowAsync(p));
  }

  protected onShowAsync(params?: any): Promise<void> {
    return Promise.resolve();
  }

  protected navigateToAsync(target: Component<any>, ...args: string[]): Promise<boolean> {
    return this.componentRouter.navigateToAsync(target, args);
  }
}
