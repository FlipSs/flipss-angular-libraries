import {TestBed} from '@angular/core/testing';
import {AppInitializerModule} from '../modules/AppInitializerModule';
import {IInitializable} from '../models/IInitializable';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {Injectable, InjectionToken, Type} from '@angular/core';
import {IInitializableType} from '../models/IInitializableType';
import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {Func} from 'flipss-common-types/types';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {APP_INITIALIZER_ERROR_LISTENER} from '../internal/AppInitializerErrorListener';

describe('AppInitializer', () => {
  const getTypes: Func<void, IInitializableType[]> = () => [
    {type: Type1, initializationStage: AppInitializationStage.preInitialization},
    {type: Type2, initializationStage: AppInitializationStage.initialization},
    {type: Type3, initializationStage: AppInitializationStage.postInitialization},
    {type: type4Token, initializationStage: AppInitializationStage.initialization}
  ];

  beforeEach(() => {
      Type1.resetIndex();
      TestBed.configureTestingModule({
        providers: [
          Type1,
          Type2,
          Type3,
          {provide: type4Token, useClass: Type4},
        ],
        imports: [
          AppInitializerModule.forRoot(getTypes(), TestErrorListener)
        ]
      });
    }
  );

  it('Should be created', () => {
    const appInitializer = TestBed.get(APP_INITIALIZER);
    expect(appInitializer).toBeTruthy();
  });

  it('Types should initialize in correct order', async () => {
    const appInitializer: IAppInitializer = TestBed.get(APP_INITIALIZER);
    await appInitializer.initializeAppTypesAsync();

    const orderedTypes = getTypes().sort((t1, t2) => t1.initializationStage - t2.initializationStage);

    for (let i = 0; i < orderedTypes.length; i++) {
      const type = orderedTypes[i];
      const typeInstance: Type1 = TestBed.get(type.type);

      expect(typeInstance.initialized).toBeTruthy();
      expect(typeInstance.index).toEqual(i);
    }
  });

  it('Should call error listener', async () => {
    const errorListener: IAppInitializerErrorListener = TestBed.get(APP_INITIALIZER_ERROR_LISTENER);
    const spy = spyOn(errorListener, 'onTypeInitializationError');
    const appInitializer: IAppInitializer = TestBed.get(APP_INITIALIZER);
    await appInitializer.initializeAppTypesAsync();

    expect(spy).toHaveBeenCalled();
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
  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();

    return Promise.reject();
  }
}

@Injectable()
class TestErrorListener implements IAppInitializerErrorListener {
  public onAppInitializationError(error: Error, stage?: AppInitializationStage): void {
  }

  public onTypeInitializationError(error: Error, type: Type<IInitializable> | InjectionToken<IInitializable>): void {
  }
}

const type4Token = new InjectionToken<Type4>('Type4');
