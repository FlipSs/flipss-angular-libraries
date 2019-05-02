import {HttpHeaders} from '@angular/common/http';

export interface IHttpHeadersProvider {
  getHeaders(): HttpHeaders;
}
