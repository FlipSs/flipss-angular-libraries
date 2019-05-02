import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {TestBed} from '@angular/core/testing';
import {AppInitializerModule} from './AppInitializerModule';

describe('AppInitializerModule', () => {
  function shouldBeCreated(): void {
    it('should be created', () => {
      expect(TestBed.get(APP_INITIALIZER)).toBeTruthy();
    });
  }

  describe('Default app initializer', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        AppInitializerModule.forRoot([])
      ]
    }));

    shouldBeCreated();
  });

  describe('Custom app initializer', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        AppInitializerModule.forRootCustom(CustomAppInitializer)
      ]
    }));

    shouldBeCreated();
  });
});

class CustomAppInitializer implements IAppInitializer {
  public initializeAppAsync(): Promise<void> {
    return Promise.resolve();
  }

  public initializeAppTypesAsync(): Promise<void> {
    return Promise.resolve();
  }
}
