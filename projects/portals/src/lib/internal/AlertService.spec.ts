import {AlertComponent} from '../components/AlertComponent';
import {Component, Inject, Optional} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {AlertServiceModule} from '../modules/AlertServiceModule';
import {ALERT_DATA, ALERT_SERVICE, IAlertService} from '../models/IAlertService';

describe('AlertService', () => {
  function isFirstShown(): boolean {
    return document.body.querySelector('#first-test') != null;
  }

  function isSecondShown(): boolean {
    return document.body.querySelector('#second-test') != null;
  }

  function delay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 100);
    });
  }

  let alertService: IAlertService;

  beforeAll(async(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FirstTestComponent,
        SecondTestComponent
      ],
      imports: [
        AlertServiceModule.forRoot([
          FirstTestComponent,
          SecondTestComponent
        ])
      ]
    }).compileComponents();

    alertService = TestBed.get(ALERT_SERVICE);
  }));

  it('Should show first component', async () => {
    const alert = await alertService.show<FirstTestComponent, void>(FirstTestComponent);
    expect(isFirstShown()).toBeTruthy();
    alert.hide();
    await delay();
    expect(isFirstShown()).toBeFalsy();
  });

  it('Should show second component', async () => {
    const data = 'test';
    const alert = await alertService.show(SecondTestComponent, data);
    expect(isSecondShown()).toBeTruthy();
    expect(alert.data).toEqual(data);

    alert.hide();
    await delay();
    expect(isSecondShown()).toBeFalsy();
  });

  it('Should enqueue component if another already shown', async () => {
    const firstAlertComponent = await alertService.show<FirstTestComponent, void>(FirstTestComponent);
    const secondAlertPromise = alertService.show(SecondTestComponent);
    expect(isFirstShown()).toBeTruthy();
    expect(isSecondShown()).toBeFalsy();

    firstAlertComponent.hide();
    const secondAlert = await secondAlertPromise;
    expect(isFirstShown()).toBeFalsy();
    expect(isSecondShown()).toBeTruthy();

    secondAlert.hide();
    await delay();
    expect(isSecondShown()).toBeFalsy();
  });
});

@Component({
  template: '<div id="first-test"></div>'
})
class FirstTestComponent extends AlertComponent<void, any> {
  public constructor() {
    super();
  }
}

@Component({
  template: '<div id="second-test"></div>'
})
class SecondTestComponent extends AlertComponent<any, void> {
  public constructor(@Inject(ALERT_DATA) @Optional() componentData?: any) {
    super(componentData);
  }
}
