import {ApiService} from './ApiService';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ApiServiceSettingsEndpointProvider} from './ApiServiceSettingsEndpointProvider';
import {IApiServiceEndpointProviderSettings} from '../models/IApiServiceEndpointProviderSettings';
import {IDisposable, IErrorObserver, ISettingObject, IValueObserver} from 'flipss-common-types';
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
    apiService.getAsync('test');

    const request = backend.expectOne('test/test');

    expect(request.request.method).toEqual('GET');
  });

  it('Should make post request', () => {
    apiService.postAsync('test');

    const request = backend.expectOne('test/test');

    expect(request.request.method).toEqual('POST');
  });
});

class TestApiServiceEndpointProviderSettingObject implements ISettingObject<IApiServiceEndpointProviderSettings> {
  public readonly value: Readonly<IApiServiceEndpointProviderSettings> = {
    endpoints: [
      'test'
    ]
  };

  subscribe(observer: IValueObserver<Readonly<IApiServiceEndpointProviderSettings>> | IErrorObserver): IDisposable {
    return undefined;
  }
}

class TestApiServiceEndpointProvider extends ApiServiceSettingsEndpointProvider<IApiServiceEndpointProviderSettings> {
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
