import {ApplicationRef, ComponentFactoryResolver, Injector} from '@angular/core';
import {Argument} from 'flipss-common-types';
import {ComponentPortal, DomPortalOutlet} from '@angular/cdk/portal';

export abstract class PortalService {
  private readonly _outlet: DomPortalOutlet;

  protected constructor(private readonly _injector: Injector,
                        componentFactoryResolver: ComponentFactoryResolver,
                        appRef: ApplicationRef) {
    Argument.isNotNullOrUndefined(this._injector, 'injector');
    Argument.isNotNullOrUndefined(componentFactoryResolver, 'componentFactoryResolver');
    Argument.isNotNullOrUndefined(appRef, 'appRef');

    this._outlet = new DomPortalOutlet(document.body,
      componentFactoryResolver,
      appRef,
      this._injector);
  }

  protected get serviceInjector(): Injector {
    return this._injector;
  }

  protected attach<T>(portal: ComponentPortal<T>): T {
    Argument.isNotNullOrUndefined(portal, 'portal');

    return this._outlet.attach(portal).instance;
  }

  protected hasAttached(): boolean {
    return this._outlet.hasAttached();
  }

  protected detach(): void {
    if (!this.hasAttached()) {
      throw new Error('No one portal attached');
    }

    this._outlet.detach();
  }
}
