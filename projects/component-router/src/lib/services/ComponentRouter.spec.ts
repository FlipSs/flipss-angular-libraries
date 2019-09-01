import {TestBed} from '@angular/core/testing';
import {ComponentRouterModule} from '../modules/ComponentRouterModule';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {Component, Type} from '@angular/core';
import {COMPONENT_ROUTER, IComponentRouter} from '../models/IComponentRouter';
import {RouterTestingModule} from '@angular/router/testing';

describe('IComponentRouter', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule.withRoutes(testAppRoutes),
      ComponentRouterModule.forRoot()
    ],
    declarations: [
      TestComponent,
      ParameterizedTestComponent,
      ChildTestComponent,
      ParameterizedChildTestComponent
    ]
  }));

  it('should be created', () => {
    const componentRouter: IComponentRouter = TestBed.get(COMPONENT_ROUTER);
    expect(componentRouter).toBeTruthy();
  });

  describe('Routing test', () => {
    let componentRouter: IComponentRouter;
    let router: Router;
    let activatedRoute: ActivatedRoute;

    function prepareUrl(url: string): string {
      return router.parseUrl(url).toString();
    }

    function equals(url1: string, url2: string, component: Type<any>, isChild: boolean = false): void {
      expect(prepareUrl(url1)).toEqual(prepareUrl(url2));
      expect(isChild ? activatedRoute.firstChild.firstChild.component : activatedRoute.firstChild.component).toEqual(component);
    }

    beforeAll(() => {
      componentRouter = TestBed.get(COMPONENT_ROUTER);
      router = TestBed.get(Router);
      activatedRoute = TestBed.get(ActivatedRoute);
    });

    it('Should get correct route', () => {
      expect(componentRouter.getUrlFor(ParameterizedTestComponent, {
        test: '15',
        test1: '20'
      })).toEqual(router.createUrlTree(ParameterizedTestComponent.getPathCommands(['15', '20'])).toString());
    });

    it('Should navigate to TestComponent', async () => {
      await componentRouter.navigateToAsync(TestComponent);
      equals(router.url, TestComponent.path, TestComponent);
    });

    it('Should navigate to ParameterizedTestComponent', async () => {
      const args = [(Math.random() * 15).toString(), 'test'];
      await componentRouter.navigateToAsync(ParameterizedTestComponent, {
        test: args[0],
        test1: args[1]
      });

      equals(router.url,
        router.createUrlTree(ParameterizedTestComponent.getPathCommands(args)).toString(),
        ParameterizedTestComponent);
    });

    it('Should navigate to ChildTestComponent', async () => {
      await componentRouter.navigateToAsync(ChildTestComponent);
      equals(router.url,
        router.createUrlTree([TestComponent.path, ChildTestComponent.path]).toString(),
        ChildTestComponent,
        true);
    });

    it('Should navigate to ParameterizedChildTestComponent', async () => {
      const args = [(Math.random() * 17).toString()];
      await componentRouter.navigateToAsync(ParameterizedChildTestComponent, {
        test: args[0]
      });
      const urlTree = router.createUrlTree([TestComponent.path].concat(ParameterizedChildTestComponent.getPathCommands(args)));
      equals(router.url, urlTree.toString(), ParameterizedChildTestComponent, true);
    });
  });
});

@Component({
  template: '<div>Test</div>'
})
class TestComponent {
  public static readonly path = 'test';
}

@Component({
  template: '<div>Test</div>'
})
class ParameterizedTestComponent {
  private static readonly pathFirstPart = 'test-parameterized';
  private static readonly pathSecondPart = 'test';
  public static readonly path = `${ParameterizedTestComponent.pathFirstPart}/:test/${ParameterizedTestComponent.pathSecondPart}/:test1`;

  public static getPathCommands(args?: string[]): string[] {
    return [this.pathFirstPart, args[0], this.pathSecondPart, args[1]];
  }
}

@Component({
  template: '<div>Test</div>'
})
class ChildTestComponent {
  public static readonly path = 'test-child';
}

@Component({
  template: '<div>Test</div>'
})
class ParameterizedChildTestComponent {
  private static readonly pathFirstPart = 'test-parameterized-child';
  public static readonly path = `${ParameterizedChildTestComponent.pathFirstPart}/:test`;

  public static getPathCommands(args?: string[]): string[] {
    return [this.pathFirstPart].concat(args);
  }
}

const testAppRoutes: Routes = [
  {
    path: TestComponent.path, component: TestComponent, children: [
      {path: ChildTestComponent.path, component: ChildTestComponent},
      {
        path: ParameterizedChildTestComponent.path, component: ParameterizedChildTestComponent, data: {
          getPathCommands(args?: string[]): string[] {
            return ParameterizedChildTestComponent.getPathCommands(args);
          }
        }
      }
    ]
  },
  {
    path: ParameterizedTestComponent.path, component: ParameterizedTestComponent, data: {
      getPathCommands(args?: string[]): string[] {
        return ParameterizedTestComponent.getPathCommands(args);
      }
    }
  }
];
