import {ApplicationRef, ComponentFactoryResolver, Injectable, InjectionToken, Injector} from '@angular/core';
import {IAlertService} from '../models/IAlertService';
import {AlertComponent} from '../components/AlertComponent';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {PortalService} from './PortalService';

@Injectable()
export class AlertService extends PortalService implements IAlertService {
  public constructor(injector: Injector,
                     componentFactoryResolver: ComponentFactoryResolver,
                     appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);
  }

  public hasShown(): boolean {
    return this.hasAttached();
  }

  public show<T extends AlertComponent<TData, any>, TData>(component: ComponentType<T>, data?: TData): T {
    if (this.hasShown()) {
      throw new Error('Alert already shown');
    }

    const portal = new ComponentPortal(component, null, this.createInjector(data));

    const instance = this.attach(portal);
    if (instance && instance.hidePromise) {
      instance.hidePromise.then(() => {
        this.detach();
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
