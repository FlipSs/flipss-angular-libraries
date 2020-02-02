import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {ALERT_DATA, IAlertService} from '../models/IAlertService';
import {AlertComponent} from '../components/AlertComponent';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {PortalService} from './PortalService';
import {Action, TypeUtils} from 'flipss-common-types';

@Injectable()
export class AlertService extends PortalService implements IAlertService {
  private readonly _alertResolveQueue: Action<any>[];

  public constructor(injector: Injector,
                     componentFactoryResolver: ComponentFactoryResolver,
                     appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);

    this._alertResolveQueue = [];
  }

  public show<T extends AlertComponent<TData, any>, TData>(component: ComponentType<T>, data?: TData): Promise<T> {
    const portal = new ComponentPortal<T>(component, null, this.createInjector(data));

    if (this.hasAttached()) {
      return new Promise<T>(resolve => this._alertResolveQueue.push(() => {
        const componentInstance = this.showInternal<T>(portal);
        resolve(componentInstance);
      }));
    }

    return Promise.resolve(this.showInternal<T>(portal));
  }

  private showInternal<T extends AlertComponent<any, any>>(portal: ComponentPortal<T>): T {
    const instance = this.attach(portal);
    if (!TypeUtils.isNullOrUndefined(instance) && !TypeUtils.isNullOrUndefined(instance.hidePromise)) {
      instance.hidePromise.then(() => {
        this.detach();

        if (this._alertResolveQueue.length > 0) {
          this._alertResolveQueue.shift()();
        }
      });
    }

    return instance;
  }

  private createInjector(data?: any): Injector | null {
    if (data == null) {
      return null;
    }

    return new PortalInjector(this.serviceInjector, new WeakMap().set(ALERT_DATA, data));
  }
}
