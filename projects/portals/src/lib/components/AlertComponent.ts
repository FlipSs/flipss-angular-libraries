import {Action, TypeUtils} from 'flipss-common-types';

export class AlertComponent<TData, TResult> {
  private readonly _hidePromise: Promise<TResult>;
  private _hideResolve: Action<TResult>;

  protected constructor(private readonly _componentData?: TData) {
    this._hidePromise = new Promise<TResult>((resolve: Action<TResult>) => {
      this._hideResolve = resolve;
    });
  }

  public get hidePromise(): Promise<TResult> {
    return this._hidePromise;
  }

  public get data(): TData {
    return this._componentData;
  }

  public hide(result?: TResult) {
    if (!TypeUtils.isNullOrUndefined(this._hideResolve)) {
      this._hideResolve(result);
      this._hideResolve = null;
    }
  }
}
