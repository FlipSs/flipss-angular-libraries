import {Inject, Injectable, InjectionToken, Injector, Optional, Type} from '@angular/core';
import {INITIALIZABLE_TYPES} from './InitializableTypes';
import {APP_INITIALIZER_ERROR_LISTENER} from './AppInitializerErrorListener';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {Argument} from 'flipss-common-types/utils';
import {IAppInitializer} from '../models/IAppInitializer';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {IInitializableType} from '../models/IInitializableType';
import {IInitializable} from '../models/IInitializable';
import {APP_INITIALIZATION_STAGE_LISTENER} from './AppInitializationStageListener';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';
import {Func} from 'flipss-common-types/types';

@Injectable()
export class AppInitializer implements IAppInitializer {
  private readonly types: IInitializableType[];
  private readonly stageListeners: IAppInitializationStageListener[];

  public constructor(@Inject(INITIALIZABLE_TYPES) types: IInitializableType[],
                     private readonly injector: Injector,
                     @Inject(APP_INITIALIZER_ERROR_LISTENER) private readonly errorListener: IAppInitializerErrorListener,
                     @Inject(APP_INITIALIZATION_STAGE_LISTENER) @Optional() stageListeners?: IAppInitializationStageListener[]) {
    Argument.isNotNullOrUndefined(types, 'IInitializableTypes');
    Argument.isNotNullOrUndefined(injector, 'AppInjector');
    Argument.isNotNullOrUndefined(errorListener, 'IAppInitializerErrorListener');

    this.types = types.sort((t1, t2) => t1.initializationStage - t2.initializationStage);
    this.stageListeners = stageListeners || [];
  }

  public async initializeAppAsync(): Promise<void> {
    let currentStage: AppInitializationStage;
    try {
      const stages: AppInitializationStage[] = Object.values(AppInitializationStage)
        .filter(v => typeof v === 'number')
        .sort((s1, s2) => s1 - s2);

      for (const stage of stages) {
        currentStage = stage;

        const stageTypes = this.getStageTypes(stage);
        const stageListeners = this.getStageListeners(stage);
        const allStageListenersAsyncAction = (getAction: Func<IAppInitializationStageListener, Promise<void>>) => {
          return Promise.all(stageListeners.map(getAction));
        };

        await allStageListenersAsyncAction(l => l.beforeInitializationAsync(stageTypes.length));

        for (const type of stageTypes) {
          await this.initializeTypeAsync(type);
          await allStageListenersAsyncAction(l => l.onTypeInitializedAsync());
        }

        await allStageListenersAsyncAction(l => l.afterInitializationAsync());
      }
    } catch (e) {
      // noinspection JSUnusedAssignment
      this.errorListener.onAppInitializationError(e, currentStage);
    }
  }

  public async initializeAppTypesAsync(): Promise<void> {
    for (const initializableType of this.types) {
      await this.initializeTypeAsync(initializableType.type);
    }
  }

  private getStageTypes(stage: AppInitializationStage): (Type<IInitializable> | InjectionToken<IInitializable>)[] {
    return this.types.filter(t => t.initializationStage === stage).map(t => t.type);
  }

  private getStageListeners(stage: AppInitializationStage): IAppInitializationStageListener[] {
    return this.stageListeners.filter(l => l.stage === stage);
  }

  private async initializeTypeAsync(type: Type<IInitializable> | InjectionToken<IInitializable>): Promise<void> {
    try {
      await this.injector.get(type).initializeAsync();
    } catch (e) {
      this.errorListener.onTypeInitializationError(e, type);
    }
  }
}
