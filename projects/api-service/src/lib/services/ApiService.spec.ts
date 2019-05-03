import {ApiService} from './ApiService';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ApiServiceEndpointProvider} from './ApiServiceEndpointProvider';
import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {ISettingObject} from 'flipss-common-types/settings';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {IApiService} from '../models/IApiService';

describe('ApiService', () => {
  let apiService: IApiService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });

    apiService = new TestApiService(TestBed.get(HttpClient));
    backend = TestBed.get(HttpTestingController);
  });

  it('Should make get request', () => {
    // noinspection JSIgnoredPromiseFromCall
    apiService.getAsync('test');

    backend.expectOne({
      url: 'test/test',
      method: 'GET'
    });
  });

  it('Should make post request', () => {
    // noinspection JSIgnoredPromiseFromCall
    apiService.postAsync('test');

    backend.expectOne({
      url: 'test/test',
      method: 'POST'
    });
  });
});

class TestApiServiceEndpointProviderSettingObject implements ISettingObject<IApiServiceEndpointProviderSettings> {
  public readonly value: Readonly<IApiServiceEndpointProviderSettings> = {
    endpoints: [
      'test'
    ]
  };
}

class TestApiServiceEndpointProvider extends ApiServiceEndpointProvider<IApiServiceEndpointProviderSettings> {
  public constructor() {
    super(new TestApiServiceEndpointProviderSettingObject());
  }

  protected selectEndpoint(endpoints: string[]) {
    return endpoints[0];
  }
}

class TestApiService extends ApiService {
  public constructor(httpClient: HttpClient) {
    super(httpClient, new TestApiServiceEndpointProvider());
  }
}