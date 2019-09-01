import {Inject, Injectable, InjectionToken, Injector, Optional, Type} from '@angular/core';
import {INITIALIZABLE_TYPES} from './InitializableTypes';
import {APP_INITIALIZER_ERROR_LISTENER} from './AppInitializerErrorListener';
import {IAppInitializerErrorListener} from '../models/IAppInitializerErrorListener';
import {Argument, asEnumerable, Func, IReadOnlyCollection, List} from 'flipss-common-types';
import {IAppInitializer} from '../models/IAppInitializer';
import {AppInitializationStage} from '../models/AppInitializationStage';
import {IInitializableType} from '../models/IInitializableType';
import {IInitializable} from '../models/IInitializable';
import {APP_INITIALIZATION_STAGE_LISTENER} from './AppInitializationStageListener';
import {IAppInitializationStageListener} from '../models/IAppInitializationStageListener';

@Injectable()
export class AppInitializer implements IAppInitializer {
  private readonly types: IReadOnlyCollection<IInitializableType>;
  private readonly stageListeners: IReadOnlyCollection<IAppInitializationStageListener>;

  public constructor(@Inject(INITIALIZABLE_TYPES) types: IInitializableType[],
                     private readonly injector: Injector,
                     @Inject(APP_INITIALIZER_ERROR_LISTENER) private readonly errorListener: IAppInitializerErrorListener,
                     @Inject(APP_INITIALIZATION_STAGE_LISTENER) @Optional() stageListeners?: IAppInitializationStageListener[]) {
    Argument.isNotNullOrUndefined(types, 'types');
    Argument.isNotNullOrUndefined(injector, 'injector');
    Argument.isNotNullOrUndefined(errorListener, 'errorListener');

    this.types = asEnumerable(types).orderBy(t => t.initializationStage).toReadOnlyList();
    this.stageListeners = new List(stageListeners);
  }

  public async initializeAppAsync(): Promise<void> {
    let currentStage: AppInitializationStage;
    try {
      const stages: AppInitializationStage[] = asEnumerable(Object.values(AppInitializationStage))
        .where(v => typeof v === 'number')
        .orderBy(s => s)
        .toArray();

      for (const stage of stages) {
        currentStage = stage;

        const stageTypes = this.getStageTypes(stage);
        const stageListeners = this.getStageListeners(stage);
        const allStageListenersAsyncAction = (getAction: Func<Promise<void>, IAppInitializationStageListener>) => {
          return Promise.all(stageListeners.select(getAction));
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

  private getStageTypes(stage: AppInitializationStage): IReadOnlyCollection<Type<IInitializable> | InjectionToken<IInitializable>> {
    return this.types.where(t => t.initializationStage === stage).select(t => t.type).toReadOnlyList();
  }

  private getStageListeners(stage: AppInitializationStage): IReadOnlyCollection<IAppInitializationStageListener> {
    return this.stageListeners.where(l => l.stage === stage).toReadOnlyList();
  }

  private async initializeTypeAsync(type: Type<IInitializable> | InjectionToken<IInitializable>): Promise<void> {
    try {
      await this.injector.get(type).initializeAsync();
    } catch (e) {
      this.errorListener.onTypeInitializationError(e, type);
    }
  }
}
