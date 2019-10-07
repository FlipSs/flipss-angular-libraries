import {HttpParams} from '@angular/common/http';

export interface IApiService {
  getAsync<T>(action: string, params?: HttpParams): Promise<T>;

  postAsync<T>(action: string, body?: any, params?: HttpParams): Promise<T>;

  deleteAsync<T>(action: string, params?: HttpParams): Promise<T>;
}
