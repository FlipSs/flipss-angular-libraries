import {Argument} from 'flipss-common-types';
import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[flipssDynamicComponentHost]'
})
export class DynamicComponentHostDirective {
  public constructor(private readonly _viewContainerRef: ViewContainerRef) {
    Argument.isNotNullOrUndefined(this._viewContainerRef, 'viewContainerRef');
  }

  public get ref(): ViewContainerRef {
    return this._viewContainerRef;
  }
}
