import {TestBed} from '@angular/core/testing';
import {AppInitializerModule} from '../modules/AppInitializerModule';
import {IInitializable} from '../models/IInitializable';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {Injectable, InjectionToken, Provider} from '@angular/core';
import {IInitializableType} from '../models/IInitializableType';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {Func} from 'flipss-common-types/types';
import {APP_INITIALIZER_ERROR_LISTENER} from './AppInitializerErrorListener';
import {AppInitializer} from './AppInitializer';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';
import {APP_INITIALIZATION_STAGE_LISTENER} from './AppInitializationStageListener';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';

describe('AppInitializer', () => {
  const getTypeProviders: Func<void, Provider[]> = () => [
    Type1,
    Type2,
    Type3,
    {provide: type4Token, useClass: Type4},
  ];

  const getTypes: Func<void, IInitializableType[]> = () => [
    {type: Type1, initializationStage: AppInitializationStage.preInitialization},
    {type: Type2, initializationStage: AppInitializationStage.initialization},
    {type: Type3, initializationStage: AppInitializationStage.postInitialization},
    {type: type4Token, initializationStage: AppInitializationStage.initialization}
  ];

  function checkTypeInitializationOrder(getInitializationAction: Func<IAppInitializer, Promise<void>>): void {
    it('Types should initialize in correct order', async () => {
      const typeSpies = getTypes().sort((t1, t2) => t1.initializationStage - t2.initializationStage)
        .map(t => spyOn(TestBed.get(t.type), 'initializeAsync'));

      await getInitializationAction(getAppInitializer());

      if (typeSpies.length > 1) {
        let previousSpy = typeSpies[0];
        for (let i = 1; i < typeSpies.length; i++) {
          const currentSpy = typeSpies[i];
          expect(previousSpy).toHaveBeenCalledBefore(currentSpy);
          previousSpy = currentSpy;
        }
      } else if (typeSpies.length === 1) {
        expect(typeSpies[0]).toHaveBeenCalled();
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

  describe('Type initialization', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes())
        ]
      });

      await waitForAppInitialization();
    });

    checkTypeInitializationOrder(a => a.initializeAppTypesAsync());

    it('Should call error listener on type initialization error', async () => {
      const spy = spyOn(TestBed.get(APP_INITIALIZER_ERROR_LISTENER), 'onTypeInitializationError');
      await getAppInitializer().initializeAppTypesAsync();

      expect(spy).toHaveBeenCalledWith(Type4.errorMessage, type4Token);
    });
  });

  describe('App initialization', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes(), undefined, [
            TestStageListener
          ])
        ]
      });

      await waitForAppInitialization();
    });

    checkTypeInitializationOrder(a => a.initializeAppAsync());

    it('Should call stage listener methods', async () => {
      const stageListener: IAppInitializationStageListener = TestBed.get(APP_INITIALIZATION_STAGE_LISTENER)[0];
      const type1InitSpy = spyOn(TestBed.get(Type1), 'initializeAsync');
      const beforeInitSpy = spyOn(stageListener, 'beforeInitializationAsync');
      const onTypeInitSpy = spyOn(stageListener, 'onTypeInitializedAsync');
      const afterInitSpy = spyOn(stageListener, 'afterInitializationAsync');

      await getAppInitializer().initializeAppAsync();

      expect(onTypeInitSpy).toHaveBeenCalledTimes(getTypes().filter(t => t.initializationStage === TestStageListener.stage).length);
      expect(type1InitSpy).toHaveBeenCalledBefore(beforeInitSpy);
      expect(beforeInitSpy).toHaveBeenCalledBefore(onTypeInitSpy);
      expect(onTypeInitSpy).toHaveBeenCalledBefore(afterInitSpy);
      expect(afterInitSpy).toHaveBeenCalled();
    });
  });

  describe('App initialization errors', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes(), undefined, [
            TestStageListenerWithError
          ])
        ]
      });

      await waitForAppInitialization();
    });

    it('Should call error listener', async () => {
      const errorListener: IAppInitializerErrorListener = TestBed.get(APP_INITIALIZER_ERROR_LISTENER);
      const spy = spyOn(errorListener, 'onAppInitializationError');

      await getAppInitializer().initializeAppAsync();
      expect(spy).toHaveBeenCalledWith(TestStageListenerWithError.error, TestStageListener.stage);
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

@Injectable()
class TestStageListener implements IAppInitializationStageListener {
  public static readonly stage = AppInitializationStage.initialization;

  public get stage(): AppInitializationStage {
    return TestStageListener.stage;
  }

  public afterInitializationAsync(): Promise<void> {
    return Promise.resolve();
  }

  public beforeInitializationAsync(typeCount: number): Promise<void> {
    return Promise.resolve();
  }

  public onTypeInitializedAsync(): Promise<void> {
    return Promise.resolve();
  }
}

@Injectable()
class TestStageListenerWithError extends TestStageListener {
  public static readonly error = new Error('test');

  public onTypeInitializedAsync(): Promise<void> {
    return Promise.reject(TestStageListenerWithError.error);
  }
}

const type4Token = new InjectionToken<Type4>('Type4');
