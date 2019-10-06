import {RoutableComponent} from './RoutableComponent';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentRouterModule} from '../modules/ComponentRouterModule';
import {RouterTestingModule} from '@angular/router/testing';
import {Component, Inject} from '@angular/core';
import {COMPONENT_ROUTER, IComponentRouter} from '../models/IComponentRouter';

describe('RoutableComponent', () => {
  let firstComponent: ComponentFixture<FirstTestComponent>;
  let secondComponent: ComponentFixture<SecondTestComponent>;
  let router: Router;

  beforeAll(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testAppRoutes),
        ComponentRouterModule.forRoot()
      ],
      declarations: [FirstTestComponent, SecondTestComponent]
    }).compileComponents();
  }));

  beforeAll(() => {
    firstComponent = TestBed.createComponent(FirstTestComponent);
    secondComponent = TestBed.createComponent(SecondTestComponent);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(firstComponent).toBeTruthy();
    expect(secondComponent).toBeTruthy();
  });

  it('Should get correct component url', () => {
    expect(firstComponent.componentInstance.getSelfUrl()).toEqual(router.createUrlTree(['']).toString());
    expect(firstComponent.componentInstance.getSecondComponentUrl('1'))
      .toEqual(router.createUrlTree([SecondTestComponent.path, '1']).toString());
  });

  it('Should navigate to second component', async () => {
    const argument = 'test' + Math.random();
    const spy = spyOn(router, 'navigateByUrl');

    await firstComponent.componentInstance.navigateToSecondComponent(argument);
    expect(spy).toHaveBeenCalledWith(router.createUrlTree([SecondTestComponent.path, argument]).toString());
  });

  it('Should navigate to url', async () => {
    const spy = spyOn(router, 'navigateByUrl');

    await firstComponent.componentInstance.navigate('test');
    expect(spy).toHaveBeenCalledWith('test');
  });
});

@Component({
  template: '<p>test</p>'
})
class FirstTestComponent extends RoutableComponent {
  public constructor(@Inject(COMPONENT_ROUTER) componentRouter: IComponentRouter) {
    super(componentRouter);
  }

  public getSelfUrl(): string {
    return this.getUrl();
  }

  public navigate(url: string): Promise<boolean> {
    return this.navigateAsync(url);
  }

  public getSecondComponentUrl(par: string): string {
    return this.getUrlFor(SecondTestComponent, {
      test: par
    });
  }

  public navigateToSecondComponent(par: string): Promise<boolean> {
    return this.navigateToAsync(SecondTestComponent, {
      test: par
    });
  }
}

@Component({
  template: '<p>test</p>'
})
class SecondTestComponent extends RoutableComponent {
  public static readonly path = 'second';

  public constructor(@Inject(COMPONENT_ROUTER) componentRouter: IComponentRouter) {
    super(componentRouter);
  }
}

const testAppRoutes: Routes = [
  {
    path: `${SecondTestComponent.path}/:test`, component: SecondTestComponent, data: {
      getPathCommands(args?: string[]): string[] {
        return [SecondTestComponent.path].concat(args);
      }
    }
  },
  {path: '', component: FirstTestComponent}
];
