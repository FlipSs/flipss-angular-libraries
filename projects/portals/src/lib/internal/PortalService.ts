import {ComponentPortal, DomPortalHost} from '@angular/cdk/portal';
import {ApplicationRef, ComponentFactoryResolver, Injector} from '@angular/core';
import {Argument} from 'flipss-common-types/utils';

export abstract class PortalService {
  private readonly host: DomPortalHost;

  protected constructor(private readonly injector: Injector,
                        componentFactoryResolver: ComponentFactoryResolver,
                        appRef: ApplicationRef) {
    Argument.isNotNullOrUndefined(injector, 'Injector');
    Argument.isNotNullOrUndefined(componentFactoryResolver, 'ComponentFactoryResolver');
    Argument.isNotNullOrUndefined(appRef, 'ApplicationRef');

    this.host = new DomPortalHost(document.body,
      componentFactoryResolver,
      appRef,
      injector);
  }

  protected get serviceInjector(): Injector {
    return this.injector;
  }

  protected attach<T>(portal: ComponentPortal<T>): T {
    Argument.isNotNullOrUndefined(portal, 'ComponentPortal');

    return this.host.attach(portal).instance;
  }

  protected hasAttached(): boolean {
    return this.host.hasAttached();
  }

  protected detach(): void {
    if (!this.hasAttached()) {
      throw new Error('No portals attached.');
    }

    this.host.detach();
  }
}
