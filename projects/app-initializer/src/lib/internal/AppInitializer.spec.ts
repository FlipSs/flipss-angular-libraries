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

  function getAppInitializer(): IAppInitializer {
    return TestBed.get(APP_INITIALIZER);
  }

  function checkTypeInitializationOrder(): void {
    const orderedTypes = getTypes().sort((t1, t2) => t1.initializationStage - t2.initializationStage);

    for (let i = 0; i < orderedTypes.length; i++) {
      const type = orderedTypes[i];
      const typeInstance: Type1 = TestBed.get(type.type);

      expect(typeInstance.initialized).toBeTruthy();
      expect(typeInstance.index).toEqual(i);
    }
  }

  describe('Type initialization', () => {
    beforeEach(() => {
      Type1.resetIndex();
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes())
        ]
      });
    });

    it('Types should initialize in correct order', async () => {
      await getAppInitializer().initializeAppTypesAsync();
      checkTypeInitializationOrder();
    });

    it('Should call error listener on type initialization error', async () => {
      const spy = spyOn(TestBed.get(APP_INITIALIZER_ERROR_LISTENER), 'onTypeInitializationError');
      await getAppInitializer().initializeAppTypesAsync();

      expect(spy).toHaveBeenCalledWith(Type4.errorMessage, type4Token);
    });
  });

  describe('App initialization', () => {
    beforeEach(() => {
      Type1.resetIndex();
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes(), undefined, [
            TestStageListener
          ])
        ]
      });
    });

    it('Types should initialize in correct order', async () => {
      await getAppInitializer().initializeAppAsync();
      checkTypeInitializationOrder();
    });

    it('Should call stage listener methods', async () => {
      const stageListener: IAppInitializationStageListener = TestBed.get(APP_INITIALIZATION_STAGE_LISTENER)[0];
      const type1InitSpy = spyOn(TestBed.get(Type1), 'initializeAsync');
      const beforeInitSpy = spyOn(stageListener, 'beforeInitializationAsync');
      const onTypeInitSpy = spyOn(stageListener, 'onTypeInitializedAsync');
      const afterInitSpy = spyOn(stageListener, 'afterInitializationAsync');

      await getAppInitializer().initializeAppAsync();

      expect(type1InitSpy).toHaveBeenCalledBefore(beforeInitSpy);
      expect(beforeInitSpy).toHaveBeenCalledBefore(onTypeInitSpy);
      expect(onTypeInitSpy).toHaveBeenCalledBefore(afterInitSpy);
      expect(afterInitSpy).toHaveBeenCalled();
    });
  });

  describe('App initialization errors', () => {
    beforeEach(() => {
      Type1.resetIndex();
      TestBed.configureTestingModule({
        providers: getTypeProviders(),
        imports: [
          AppInitializerModule.forRoot(getTypes(), undefined, [
            TestStageListenerWithError
          ])
        ]
      });
    });

    it('Should call error listener', async () => {
      const errorListener: IAppInitializerErrorListener = TestBed.get(APP_INITIALIZER_ERROR_LISTENER);
      const spy = spyOn(errorListener, 'onAppInitializationError');

      await getAppInitializer().initializeAppAsync();
      expect(spy).toHaveBeenCalledWith(TestStageListenerWithError.error, TestStageListener.stage);
    });
  });
});

class Type1 implements IInitializable {
  private static initializationIndex = -1;
  public initialized: boolean;
  public readonly index: number;

  public constructor() {
    this.index = ++Type1.initializationIndex;
  }

  public static resetIndex(): void {
    this.initializationIndex = -1;
  }

  public initializeAsync(): Promise<void> {
    this.initialized = true;

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
