import {TestBed} from '@angular/core/testing';
import {ComponentRouterModule} from '../modules/ComponentRouterModule';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {Component, Type} from '@angular/core';
import {COMPONENT_ROUTER, IComponentRouter} from '../models/IComponentRouter';
import {RouterTestingModule} from '@angular/router/testing';
import {ComponentKey} from "../models/ComponentKey";
import {IComponentRouteMetadata} from "../models/IComponentRouteMetadata";
import {ComponentRouteMetadata} from "../models/ComponentRouteMetadata";
import {IComponentKey} from "../models/IComponentKey";

describe('IComponentRouter', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule.withRoutes(testAppRoutes),
      ComponentRouterModule.forRoot(routerConfiguration)
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
      expect(componentRouter.getUrlFor(parameterizedTestComponentKey, {
        test: '15',
        test1: '20'
      })).toEqual(router.createUrlTree(ParameterizedTestComponent.getPathCommands(['15', '20'])).toString());
    });

    it('Should navigate to TestComponent', async () => {
      await componentRouter.navigateToAsync(testComponentKey);
      equals(router.url, TestComponent.routePath, TestComponent);
    });

    it('Should navigate to url', async () => {
      await componentRouter.navigateAsync(TestComponent.routePath);
      equals(router.url, TestComponent.routePath, TestComponent);
    });

    it('Should navigate to ParameterizedTestComponent', async () => {
      const args = [(Math.random() * 15).toString(), 'test'];
      await componentRouter.navigateToAsync(parameterizedTestComponentKey, {
        test: args[0],
        test1: args[1]
      });

      equals(router.url,
        router.createUrlTree(ParameterizedTestComponent.getPathCommands(args)).toString(),
        ParameterizedTestComponent);
    });

    it('Should navigate to ChildTestComponent', async () => {
      await componentRouter.navigateToAsync(childTestComponentKey);
      equals(router.url,
        router.createUrlTree([TestComponent.routePath, ChildTestComponent.routePath]).toString(),
        ChildTestComponent,
        true);
    });

    it('Should navigate to ParameterizedChildTestComponent', async () => {
      const args = [(Math.random() * 17).toString()];
      await componentRouter.navigateToAsync(parameterizedChildTestComponentKey, {
        test: args[0]
      });
      const urlTree = router.createUrlTree([TestComponent.routePath].concat(ParameterizedChildTestComponent.getPathCommands(args)));
      equals(router.url, urlTree.toString(), ParameterizedChildTestComponent, true);
    });
  });
});

@Component({
  template: '<div>Test</div>'
})
class TestComponent {
  public static readonly routePath = 'test';
}

@Component({
  template: '<div>Test</div>'
})
class ParameterizedTestComponent {
  private static readonly _pathFirstPart = 'test-parameterized';
  private static readonly _pathSecondPart = 'test';
  public static readonly routePath = `${ParameterizedTestComponent._pathFirstPart}/:test/${ParameterizedTestComponent._pathSecondPart}/:test1`;

  public static getPathCommands(args?: string[]): string[] {
    return [this._pathFirstPart, args[0], this._pathSecondPart, args[1]];
  }
}

@Component({
  template: '<div>Test</div>'
})
class ChildTestComponent {
  public static readonly routePath = 'test-child';
}

@Component({
  template: '<div>Test</div>'
})
class ParameterizedChildTestComponent {
  private static readonly _pathFirstPart = 'test-parameterized-child';
  public static readonly routePath = `${ParameterizedChildTestComponent._pathFirstPart}/:test`;

  public static getPathCommands(args?: string[]): string[] {
    return [this._pathFirstPart].concat(args);
  }
}

const testComponentKey: IComponentKey<void> = new ComponentKey(TestComponent.routePath, 'TestComponent');
const childTestComponentKey: IComponentKey<void> = new ComponentKey(ChildTestComponent.routePath, 'ChildTestComponent');
const parameterizedChildTestComponentKey: IComponentKey<IChildParams> = new ComponentKey<IChildParams>(ParameterizedChildTestComponent.routePath, 'ParameterizedChildTestComponent');
const parameterizedTestComponentKey: IComponentKey<IParams> = new ComponentKey<IParams>(ParameterizedTestComponent.routePath, 'ParameterizedTestComponent');

interface IParams {
  test: string;
  test1: string;
}

interface IChildParams {
  test: string;
}

const routerConfiguration: IComponentRouteMetadata[] = [
  new ComponentRouteMetadata(testComponentKey, [
    new ComponentRouteMetadata(childTestComponentKey),
    new ComponentRouteMetadata(parameterizedChildTestComponentKey)
  ]),
  new ComponentRouteMetadata(parameterizedTestComponentKey)
];

const testAppRoutes: Routes = [
  {
    path: testComponentKey.path, component: TestComponent, children: [
      {path: childTestComponentKey.path, component: ChildTestComponent},
      {path: parameterizedChildTestComponentKey.path, component: ParameterizedChildTestComponent}
    ]
  },
  {path: parameterizedTestComponentKey.path, component: ParameterizedTestComponent}
];
