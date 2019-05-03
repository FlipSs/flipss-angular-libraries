import {ApplicationRef, ComponentFactoryResolver, Injectable, InjectionToken, Injector} from '@angular/core';
import {IAlertService} from '../models/IAlertService';
import {AlertComponent} from '../components/AlertComponent';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {PortalService} from './PortalService';
import {Action} from 'flipss-common-types/types';

@Injectable()
export class AlertService extends PortalService implements IAlertService {
  private readonly alertResolveQueue: Action<any>[];

  public constructor(injector: Injector,
                     componentFactoryResolver: ComponentFactoryResolver,
                     appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);

    this.alertResolveQueue = [];
  }

  public show<T extends AlertComponent<TData, any>, TData>(component: ComponentType<T>, data?: TData): Promise<T> {
    const portal = new ComponentPortal<T>(component, null, this.createInjector(data));

    if (this.hasAttached()) {
      let promiseResolve: Action<T>;
      const promise = new Promise<T>(resolve => {
        promiseResolve = () => {
          const componentInstance = this.showInternal<T>(portal);
          resolve(componentInstance);
        };
      });

      // noinspection JSUnusedAssignment
      this.alertResolveQueue.push(promiseResolve);

      return promise;
    }

    return Promise.resolve(this.showInternal<T>(portal));
  }

  private showInternal<T extends AlertComponent<any, any>>(portal: ComponentPortal<T>): T {
    const instance = this.attach(portal);
    if (instance && instance.hidePromise) {
      instance.hidePromise.then(() => {
        this.detach();
        if (this.alertResolveQueue.length > 0) {
          this.alertResolveQueue.shift()();
        }
      });
    }

    return instance;
  }

  private createInjector(data?: any): Injector | null {
    if (data != null) {
      const injectionTokens = new WeakMap().set(ALERT_DATA, data);

      return new PortalInjector(this.serviceInjector, injectionTokens);
    }

    return null;
  }
}

export const ALERT_DATA = new InjectionToken<any>('AlertData');
