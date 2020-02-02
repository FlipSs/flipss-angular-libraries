import {APP_INITIALIZER, IAppInitializer} from '../models/IAppInitializer';
import {TestBed} from '@angular/core/testing';
import {AppInitializerModule} from './AppInitializerModule';
import {AppInitializerEmptyErrorListener} from '../internal/AppInitializerEmptyErrorListener';
import {Injectable} from '@angular/core';

describe('AppInitializerModule', () => {
  function shouldBeCreated(): void {
    it('should be created', () => {
      expect(TestBed.get(APP_INITIALIZER)).toBeTruthy();
    });
  }

  describe('Default app initializer', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        TestErrorListener
      ],
      imports: [
        AppInitializerModule.forRoot([], TestErrorListener)
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

@Injectable()
class TestErrorListener extends AppInitializerEmptyErrorListener {
}

class CustomAppInitializer implements IAppInitializer {
  public initializeAppAsync(): Promise<void> {
    return Promise.resolve();
  }
}
