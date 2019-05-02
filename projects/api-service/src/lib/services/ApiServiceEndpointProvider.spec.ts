import {ApiServiceEndpointProvider} from './ApiServiceEndpointProvider';
import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {ISettingObject} from 'flipss-common-types/settings';
import {Subject} from 'rxjs';

describe('ApiServiceEndpointProvider', () => {
  it('Should change value on settings update', () => {
    const endpoints = ['one', 'two'];
    const settingObject = new TestEndpointProviderSettingObject(Array.from(endpoints));
    const endpointProvider = new TestEndpointProvider(settingObject);

    expect(endpointProvider.getEndpoint()).toEqual(endpoints[0]);
    settingObject.updateValue();
    expect(endpointProvider.getEndpoint()).toEqual(endpoints[1]);
  });
});

class TestEndpointProviderSettingObject implements ISettingObject<IApiServiceEndpointProviderSettings> {
  public readonly valueUpdated: Subject<void>;
  private currentValue: IApiServiceEndpointProviderSettings;

  public constructor(private readonly values: string[]) {
    this.valueUpdated = new Subject<void>();
    this.updateValue();
  }

  public get value(): Readonly<IApiServiceEndpointProviderSettings> {
    return this.currentValue;
  }

  public updateValue(): void {
    this.currentValue = {
      endpoints: [this.values.shift()]
    };

    this.valueUpdated.next();
  }
}

class TestEndpointProvider extends ApiServiceEndpointProvider<IApiServiceEndpointProviderSettings> {
  public constructor(settings: ISettingObject<IApiServiceEndpointProviderSettings>) {
    super(settings);
  }

  protected selectEndpoint(endpoints: string[]) {
    return endpoints[0];
  }
}
