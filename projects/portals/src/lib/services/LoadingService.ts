import {PortalService} from '../internal/PortalService';
import {ILoadingService} from '../models/ILoadingService';
import {ApplicationRef, ComponentFactoryResolver, Injector} from '@angular/core';
import {Argument, Lazy} from 'flipss-common-types';
import {ComponentPortal} from '@angular/cdk/portal';

export abstract class LoadingService<TComponent> extends PortalService implements ILoadingService {
  private readonly _portal: Lazy<ComponentPortal<TComponent>>;
  private _shownCount: number;

  protected constructor(injector: Injector,
                        componentFactoryResolver: ComponentFactoryResolver,
                        appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);

    this._portal = new Lazy<ComponentPortal<TComponent>>(() => this.createPortal());
    this._shownCount = 0;
  }

  public showUntil(promise: Promise<any>): void {
    Argument.isNotNullOrUndefined(promise, 'promise');

    if (!this.hasAttached()) {
      this.attach(this._portal.value);
    }

    this._shownCount++;

    promise.finally(() => this.hide());
  }

  protected abstract createPortal(): ComponentPortal<TComponent>;

  private hide(): void {
    this._shownCount--;

    if (this._shownCount === 0 && this.hasAttached()) {
      this.detach();
    }
  }
}
