import {ApplicationRef, Component, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {LoadingService} from './LoadingService';
import {ComponentPortal} from '@angular/cdk/portal';
import {async, TestBed} from '@angular/core/testing';
import {LoadingServiceModule} from '../modules/LoadingServiceModule';
import {ILoadingService, LOADING_SERVICE} from '../models/ILoadingService';
import {Action} from 'flipss-common-types';

describe('LoadingService', () => {
  let loadingService: ILoadingService;

  function isShown(): boolean {
    return document.body.querySelector('#test-loading-service') != null;
  }

  function delay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 100);
    });
  }

  beforeAll(async(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoadingServiceTestComponent
      ],
      imports: [
        LoadingServiceModule.forRoot(TestLoadingService, LoadingServiceTestComponent)
      ]
    }).compileComponents();

    loadingService = TestBed.get(LOADING_SERVICE);
  }));

  it('Should be shown while promise executing', async () => {
    let promiseResolve: Action<void>;
    const promise = new Promise<void>(resolve => {
      promiseResolve = resolve;
    });

    loadingService.showUntil(promise);
    expect(isShown()).toBeTruthy();
    // noinspection JSUnusedAssignment
    promiseResolve();

    await delay();
    expect(isShown()).toBeFalsy();
  });

  it('Should be shown when at least one promise executing', async () => {
    const resolves: Action<void>[] = [];
    for (let i = 0; i < 5; i++) {
      const promise = new Promise<void>(resolve => {
        resolves.push(resolve);
      });

      loadingService.showUntil(promise);
    }

    for (const resolve of resolves) {
      expect(isShown()).toBeTruthy();
      resolve();
      await delay();
    }

    expect(isShown()).toBeFalsy();
  });

  it('Should hide when promise rejected', async () => {
    let promiseReject: Action<string>;
    const promise = new Promise<void>((resolve, reject) => {
      promiseReject = reject;
    });

    loadingService.showUntil(promise);
    expect(isShown()).toBeTruthy();

    // noinspection JSUnusedAssignment
    promiseReject('test');
    await delay();
    expect(isShown()).toBeFalsy();
  });
});

@Injectable()
class TestLoadingService extends LoadingService<LoadingServiceTestComponent> {
  public constructor(injector: Injector,
                     componentFactoryResolver: ComponentFactoryResolver,
                     appRef: ApplicationRef) {
    super(injector, componentFactoryResolver, appRef);
  }

  protected createPortal(): ComponentPortal<LoadingServiceTestComponent> {
    return new ComponentPortal<LoadingServiceTestComponent>(LoadingServiceTestComponent);
  }
}

@Component({
  template: '<div id="test-loading-service">Loading...</div>'
})
class LoadingServiceTestComponent {
}
