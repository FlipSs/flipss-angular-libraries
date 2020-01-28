import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface IApiService {
  getAsync<T>(action: string, params?: HttpParams): Observable<T>;

  postAsync<T>(action: string, body?: any, params?: HttpParams): Observable<T>;

  deleteAsync<T>(action: string, params?: HttpParams): Observable<T>;
}
