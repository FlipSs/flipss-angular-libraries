import {PortalService} from '../internal/PortalService';
import {ILoadingService} from '../models/ILoadingService';
import {ApplicationRef, ComponentFactoryResolver, Injector} from '@angular/core';
import {Lazy} from 'flipss-common-types';
import {ComponentPortal} from '@angular/cdk/portal';

export abstract class LoadingService<TComponent> extends PortalService implements ILoadingService {
  private readonly portal: Lazy<ComponentPortal<TComponent>>;
  private shownCount: number;

  protected constructor(injector: Injector,
                        componentFactoryResolver: ComponentFactoryResolver,
                        appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);

    this.shownCount = 0;
    this.portal = new Lazy<ComponentPortal<TComponent>>(() => this.createPortal());
  }

  public showUntil(promise: Promise<void>): void {
    if (!promise) {
      return;
    }

    if (!this.hasAttached()) {
      this.attach(this.portal.value);
    }

    this.shownCount++;

    promise.finally(() => this.hide());
  }

  protected abstract createPortal(): ComponentPortal<TComponent>;

  private hide(): void {
    this.shownCount--;

    if (this.shownCount === 0 && this.hasAttached()) {
      this.detach();
    }
  }
}
