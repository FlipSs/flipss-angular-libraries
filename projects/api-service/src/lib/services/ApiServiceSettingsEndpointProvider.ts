import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {Argument, IDisposable, ISettingObject, IValueObserver, Lazy} from 'flipss-common-types';
import {IApiServiceEndpointProvider} from '../models/IApiServiceEndpointProvider';

export abstract class ApiServiceSettingsEndpointProvider<TSettings extends IApiServiceEndpointProviderSettings>
  implements IValueObserver<TSettings>, IApiServiceEndpointProvider, IDisposable {
  private readonly _currentEndpoint: Lazy<string>;
  private readonly _subscription: IDisposable;

  protected constructor(private readonly settings: ISettingObject<TSettings>) {
    Argument.isNotNullOrUndefined(settings, 'settings');

    this._currentEndpoint = new Lazy<string>(() => this.selectEndpoint(this.endpoints));
    this._subscription = settings.subscribe(this);
  }

  private get endpoints(): ReadonlyArray<string> {
    const settings = this.getSettings();

    return settings && settings.endpoints || [];
  }

  public getEndpoint(): string {
    return this._currentEndpoint.value;
  }

  public onNext(value: Readonly<TSettings>): void {
    this._currentEndpoint.reset();
  }

  public dispose(): void {
    this._subscription.dispose();
  }

  protected getSettings(): TSettings {
    return this.settings.value;
  }

  protected abstract selectEndpoint(endpoints: ReadonlyArray<string>): string;
}
