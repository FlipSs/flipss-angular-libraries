import {TestBed} from '@angular/core/testing';
import {AppInitializerModule} from '../modules/AppInitializerModule';
import {IInitializable} from '../models/IInitializable';
import {InjectionToken, Provider} from '@angular/core';
import {IInitializableInjectionToken} from '../models/IInitializableInjectionToken';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {Func} from 'flipss-common-types';
import {AppInitializer} from './AppInitializer';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {APP_INITIALIZER_ERROR_LISTENER} from "./tokens";

describe('AppInitializer', () => {
  const getProviders: Func<Provider[]> = () => [
    Type1,
    Type2,
    Type3,
    {provide: type4Token, useClass: Type4},
  ];

  const getTokens: Func<IInitializableInjectionToken[]> = () => [
    {value: Type1},
    {value: Type2},
    {value: Type3},
    {value: type4Token}
  ];

  function checkTypeInitializationOrder(): void {
    it('Types should initialize in correct order', async () => {
      const tokenSpies = getTokens().map(t => spyOn(TestBed.get(t.value), 'initializeAsync'));

      await getAppInitializer().initializeAppAsync();

      if (tokenSpies.length > 1) {
        let previousSpy = tokenSpies[0];
        for (let i = 1; i < tokenSpies.length; i++) {
          const currentSpy = tokenSpies[i];
          expect(previousSpy).toHaveBeenCalledBefore(currentSpy);
          previousSpy = currentSpy;
        }
      } else if (tokenSpies.length === 1) {
        expect(tokenSpies[0]).toHaveBeenCalled();
      }
    });
  }

  function getAppInitializer(): IAppInitializer {
    return TestBed.get(APP_INITIALIZER);
  }

  function waitForAppInitialization(): Promise<void> {
    getAppInitializer();

    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000);
    });
  }

  describe('App initialization', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: getProviders(),
        imports: [
          AppInitializerModule.forRoot(getTokens())
        ]
      });

      await waitForAppInitialization();
    });

    checkTypeInitializationOrder();
  });

  describe('App initialization errors', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [...getProviders(), ErrorType],
        imports: [
          AppInitializerModule.forRoot([...getTokens(), {value: ErrorType}])
        ]
      });

      await waitForAppInitialization();
    });

    it('Should call error listener', async () => {
      const errorListener: IAppInitializerErrorListener = TestBed.get(APP_INITIALIZER_ERROR_LISTENER);
      const spy = spyOn(errorListener, 'onInitializationError');

      await getAppInitializer().initializeAppAsync();
      expect(spy).toHaveBeenCalledWith(error, TestBed.get(ErrorType));
    });
  });
})
;

class Type1 implements IInitializable {
  public initializeAsync(): Promise<void> {
    return Promise.resolve();
  }
}

class Type2 extends Type1 {
}

class Type3 extends Type1 {
}

class Type4 extends Type1 {
  public static readonly errorMessage = 'test';

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();

    return Promise.reject(Type4.errorMessage);
  }
}

class ErrorType implements IInitializable {
  public initializeAsync(): Promise<void> {
    return Promise.reject(error);
  }
}

const error = 'error';
const type4Token = new InjectionToken<Type4>('Type4');
