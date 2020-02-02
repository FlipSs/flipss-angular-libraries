import {HttpClient, HttpParams} from '@angular/common/http';
import {IApiServiceEndpointProvider} from '../models/IApiServiceEndpointProvider';
import {Argument} from 'flipss-common-types';
import {IHttpHeadersProvider} from '../models/IHttpHeadersProvider';
import {ResponseType} from '../models/ResponseType';
import {IApiService} from '../models/IApiService';
import {Observable} from 'rxjs';

export class ApiService implements IApiService {
  public constructor(private readonly _httpClient: HttpClient,
                     private readonly _endpointProvider: IApiServiceEndpointProvider,
                     private readonly _httpHeadersProvider?: IHttpHeadersProvider) {
    Argument.isNotNullOrUndefined(this._httpClient, 'httpClient');
    Argument.isNotNullOrUndefined(this._endpointProvider, 'endpointProvider');
  }

  protected get responseType(): ResponseType {
    return ResponseType.json;
  }

  public getAsync<T>(action: string, params?: HttpParams): Observable<T> {
    return this._httpClient.get<T>(this.buildUrl(action), this.getOptions(params));
  }

  public postAsync<T>(action: string, body?: any, params?: HttpParams): Observable<T> {
    return this._httpClient.post<T>(this.buildUrl(action), body, this.getOptions(params));
  }

  public deleteAsync<T>(action: string, params?: HttpParams): Observable<T> {
    return this._httpClient.delete<T>(this.buildUrl(action), this.getOptions(params));
  }

  private buildUrl(action: string): string {
    return `${this._endpointProvider.getEndpoint()}/${action}`;
  }

  private getOptions(params?: HttpParams) {
    return {
      headers: this._httpHeadersProvider && this._httpHeadersProvider.getHeaders(),
      params,
      responseType: this.responseType as 'json'
    };
  }
}
