import {Inject, Injectable, InjectionToken, Injector, Optional, Type} from '@angular/core';
import {INITIALIZABLE_TYPES} from '../internal/InitializableTypes';
import {APP_INITIALIZER_ERROR_LISTENER} from '../internal/AppInitializerErrorListener';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {Argument} from 'flipss-common-types/utils';
import {Func} from 'flipss-common-types/types';
import {IAppInitializer} from '../models/IAppInitializer';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {IInitializableType} from '../models/IInitializableType';
import {IInitializable} from '../models/IInitializable';

@Injectable()
export class AppInitializer implements IAppInitializer {
  private readonly types: IInitializableType[];

  public constructor(@Inject(INITIALIZABLE_TYPES) types: IInitializableType[],
                     private readonly injector: Injector,
                     @Inject(APP_INITIALIZER_ERROR_LISTENER) @Optional() private readonly errorListener?: IAppInitializerErrorListener) {
    Argument.isNotNullOrUndefined(types, 'IInitializableTypes');
    Argument.isNotNullOrUndefined(injector, 'AppInjector');

    this.types = types.sort((t1, t2) => t1.initializationStage - t2.initializationStage);
  }

  public async initializeAppAsync(): Promise<void> {
    let currentStage: AppInitializationStage;
    try {
      const initializeStageAsync: Func<AppInitializationStage, Promise<void>> = async (initializationStage: AppInitializationStage) => {
        currentStage = initializationStage;

        const types = this.types.filter(t => t.initializationStage === initializationStage);
        await this.beforeInitalizationStageAsync(initializationStage, types.length);

        for (const initializableType of types) {
          await this.initializeTypeAsync(initializableType.type);
          await this.onTypeInitialized(initializationStage);
        }

        await this.afterInitalizationStageAsync(initializationStage);
      };

      await initializeStageAsync(AppInitializationStage.preInitialization);
      await initializeStageAsync(AppInitializationStage.initialization);
      await initializeStageAsync(AppInitializationStage.postInitialization);
    } catch (e) {
      if (this.errorListener) {
        // noinspection JSUnusedAssignment
        this.errorListener.onAppInitializationError(e, currentStage);
      }
    }
  }

  public async initializeAppTypesAsync(): Promise<void> {
    for (const initializableType of this.types) {
      await this.initializeTypeAsync(initializableType.type);
    }
  }

  protected beforeInitalizationStageAsync(stage: AppInitializationStage, typeCount: number): Promise<void> {
    return Promise.resolve();
  }

  protected afterInitalizationStageAsync(stage: AppInitializationStage): Promise<void> {
    return Promise.resolve();
  }

  protected onTypeInitialized(stage: AppInitializationStage): Promise<void> {
    return Promise.resolve();
  }

  private initializeTypeAsync(type: Type<IInitializable> | InjectionToken<IInitializable>): Promise<void> {
    try {
      return this.injector.get(type).initializeAsync();
    } catch (e) {
      if (this.errorListener) {
        this.errorListener.onTypeInitializationError(e, type);
      }
    }
  }
}
