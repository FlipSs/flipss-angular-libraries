import {TestBed} from "@angular/core/testing";
import {DynamicComponentModule} from "../modules/DynamicComponentModule";
import {Component, Inject, Injectable, Type, ViewChild} from "@angular/core";
import {DynamicComponentHostDirective} from "../directives/dynamic-component-host.directive";
import {
  DYNAMIC_COMPONENT_FACTORY_PROVIDER,
  IDynamicComponentFactoryProvider
} from "../models/IDynamicComponentFactoryProvider";
import {IDynamicComponentMetadata} from "../models/IDynamicComponentMetadata";
import {Argument} from "flipss-common-types";

describe('IDynamicComponentFactory', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Metadata
    ],
    imports: [
      DynamicComponentModule.forRoot()
    ],
    declarations: [
      TestComponent,
      TestDynamicComponent
    ]
  }));

  it('Should call initializeComponentAsync with component instance', async () => {
    const metadata = TestBed.inject(Metadata);
    const spy = spyOn(metadata, 'initializeComponentAsync');
    const component = TestBed.createComponent(TestComponent);
    await component.componentInstance.initializeAsync();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

@Injectable()
class Metadata implements IDynamicComponentMetadata<TestDynamicComponent> {
  public get componentType(): Type<TestDynamicComponent> {
    return TestDynamicComponent;
  }

  public initializeComponentAsync(component: TestDynamicComponent): Promise<void> {
    Argument.isNotNullOrUndefined(component, 'component');

    return Promise.resolve();
  }
}

@Component({
  template: `
    <div flipssDynamicComponentHost></div>`
})
class TestComponent {
  @ViewChild(DynamicComponentHostDirective, {static: true})
  private readonly host: DynamicComponentHostDirective;

  public constructor(@Inject(DYNAMIC_COMPONENT_FACTORY_PROVIDER) private readonly _factoryProvider: IDynamicComponentFactoryProvider,
                     private readonly _metadata: Metadata) {
  }

  public async initializeAsync(): Promise<void> {
    const factory = this._factoryProvider.get(this.host.ref);

    await factory.createAsync(this._metadata);
  }
}

@Component({
  template: '<div>Test</div>'
})
class TestDynamicComponent {
}
