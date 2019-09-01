import {Action} from 'flipss-common-types';

export class AlertComponent<TData, TResult> {
  public readonly hidePromise: Promise<TResult>;
  private hideResolve: Action<TResult>;

  protected constructor(private readonly componentData?: TData) {
    this.hidePromise = new Promise<TResult>((resolve: Action<TResult>) => {
      this.hideResolve = resolve;
    });
  }

  public get data(): TData {
    return this.componentData;
  }

  public hide(result?: TResult) {
    if (this.hideResolve) {
      this.hideResolve(result);
      this.hideResolve = null;
    }
  }
}
