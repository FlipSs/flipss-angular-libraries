import {HttpClient, HttpParams} from '@angular/common/http';
import {IApiServiceEndpointProvider} from '../models/IApiServiceEndpointProvider';
import {Argument} from 'flipss-common-types';
import {IHttpHeadersProvider} from '../models/IHttpHeadersProvider';
import {ResponseType} from '../models/ResponseType';
import {IApiService} from '../models/IApiService';

export class ApiService implements IApiService {
  public constructor(private readonly httpClient: HttpClient,
                     private readonly endpointProvider: IApiServiceEndpointProvider,
                     private readonly httpHeadersProvider?: IHttpHeadersProvider) {
    Argument.isNotNullOrUndefined(httpClient, 'httpClient');
    Argument.isNotNullOrUndefined(endpointProvider, 'endpointProvider');
  }

  protected get responseType(): ResponseType {
    return ResponseType.json;
  }

  public getAsync<T>(action: string, params?: HttpParams): Promise<T> {
    return this.httpClient.get<T>(this.buildUrl(action), this.getOptions(params)).toPromise();
  }

  public postAsync<T>(action: string, body?: any, params?: HttpParams): Promise<T> {
    return this.httpClient.post<T>(this.buildUrl(action), body, this.getOptions(params)).toPromise();
  }

  private buildUrl(action: string): string {
    return `${this.endpointProvider.getEndpoint()}/${action}`;
  }

  private getOptions(params?: HttpParams) {
    return {
      headers: this.httpHeadersProvider && this.httpHeadersProvider.getHeaders(),
      params,
      responseType: this.responseType as 'json'
    };
  }
}
