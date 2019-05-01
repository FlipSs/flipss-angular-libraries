import {RoutableComponent} from './RoutableComponent';
import {COMPONENT_ROUTER, IComponentRouter} from '../models/IComponentRouter';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {Component, Inject} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentRouterModule} from '../modules/ComponentRouterModule';
import {RouterTestingModule} from '@angular/router/testing';

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

  it('Should navigate to second component', async () => {
    const argument = 'test' + Math.random();
    const spy = spyOn(router, 'navigate');

    await firstComponent.componentInstance.navigateToSecondComponent(argument);
    expect(spy).toHaveBeenCalledWith([SecondTestComponent.path, argument]);
  });
});

@Component({
  template: '<p>test</p>'
})
class FirstTestComponent extends RoutableComponent {
  public constructor(@Inject(COMPONENT_ROUTER) componentRouter: IComponentRouter,
                     activatedRoute: ActivatedRoute) {
    super(componentRouter, activatedRoute);
  }

  public navigateToSecondComponent(par: string): Promise<boolean> {
    return this.navigateToAsync(SecondTestComponent, par);
  }
}

@Component({
  template: '<p>test</p>'
})
class SecondTestComponent extends RoutableComponent {
  public static readonly path = 'second';

  public constructor(@Inject(COMPONENT_ROUTER) componentRouter: IComponentRouter,
                     activatedRoute: ActivatedRoute) {
    super(componentRouter, activatedRoute);
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
