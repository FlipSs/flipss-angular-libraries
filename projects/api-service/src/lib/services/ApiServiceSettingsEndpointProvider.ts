import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {Argument, ISettingObject, IValueObserver, Lazy} from 'flipss-common-types';
import {IApiServiceEndpointProvider} from '../models/IApiServiceEndpointProvider';

export abstract class ApiServiceSettingsEndpointProvider<TSettings extends IApiServiceEndpointProviderSettings>
  implements IValueObserver<TSettings>, IApiServiceEndpointProvider {
  private readonly currentEndpoint: Lazy<string>;

  protected constructor(private readonly settings: ISettingObject<TSettings>) {
    Argument.isNotNullOrUndefined(settings, 'settings');

    this.currentEndpoint = new Lazy<string>(() => this.selectEndpoint(this.endpoints));

    settings.subscribe(this);
  }

  private get endpoints(): string[] {
    const settings = this.getSettings();

    return settings && settings.endpoints || [];
  }

  public getEndpoint(): string {
    return this.currentEndpoint.value;
  }

  public onNext(value: Readonly<TSettings>): void {
    this.currentEndpoint.reset();
  }

  protected getSettings(): TSettings {
    return this.settings.value;
  }

  protected abstract selectEndpoint(endpoints: string[]): string;
}
