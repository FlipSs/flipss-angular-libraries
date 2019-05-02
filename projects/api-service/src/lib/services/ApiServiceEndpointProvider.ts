import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {ISettingObject} from 'flipss-common-types/settings';
import {IApiServiceEndpointProvider} from '../models/IApiServiceEndpointProvider';
import {Argument, Lazy} from 'flipss-common-types/utils';

export abstract class ApiServiceEndpointProvider<TSettings extends IApiServiceEndpointProviderSettings>
  implements IApiServiceEndpointProvider {
  private readonly currentEndpoint: Lazy<string>;

  protected constructor(private readonly settings: ISettingObject<TSettings>) {
    Argument.isNotNullOrUndefined(settings, 'Settings');

    this.currentEndpoint = new Lazy<string>(() => this.selectEndpoint(this.endpoints));
    if (settings.valueUpdated) {
      settings.valueUpdated.subscribe(() => this.currentEndpoint.reset());
    }
  }

  private get endpoints(): string[] {
    const settings = this.getSettings();

    return settings && settings.endpoints || [];
  }

  public getEndpoint(): string {
    return this.currentEndpoint.value;
  }

  protected getSettings(): TSettings {
    return this.settings.value;
  }

  protected abstract selectEndpoint(endpoints: string[]);
}
