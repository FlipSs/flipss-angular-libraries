import {ApiServiceSettingsEndpointProvider} from './ApiServiceSettingsEndpointProvider';
import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {ISettingObject, Observable} from 'flipss-common-types';

describe('ApiServiceSettingsEndpointProvider', () => {
  it('Should change value on settings update', () => {
    const endpoints = ['one', 'two'];
    const settingObject = new TestEndpointProviderSettingObject(Array.from(endpoints));
    const endpointProvider = new TestEndpointProvider(settingObject);

    expect(endpointProvider.getEndpoint()).toEqual(endpoints[0]);
    settingObject.updateValue();
    expect(endpointProvider.getEndpoint()).toEqual(endpoints[1]);
  });
});

class TestEndpointProviderSettingObject extends Observable<IApiServiceEndpointProviderSettings>
  implements ISettingObject<IApiServiceEndpointProviderSettings> {
  private currentValue: IApiServiceEndpointProviderSettings;

  public constructor(private readonly values: string[]) {
    super();
    this.updateValue();
  }

  public get value(): Readonly<IApiServiceEndpointProviderSettings> {
    return this.currentValue;
  }

  public updateValue(): void {
    this.currentValue = {
      endpoints: [this.values.shift()]
    };

    this.next(this.currentValue);
  }
}

class TestEndpointProvider extends ApiServiceSettingsEndpointProvider<IApiServiceEndpointProviderSettings> {
  public constructor(settings: ISettingObject<IApiServiceEndpointProviderSettings>) {
    super(settings);
  }

  protected selectEndpoint(endpoints: string[]) {
    return endpoints[0];
  }
}
