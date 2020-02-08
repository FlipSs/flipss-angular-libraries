import {ModuleWithProviders, NgModule} from '@angular/core';
import {ALERT_SERVICE} from '../models/IAlertService';
import {AlertService} from '../internal/AlertService';
import {PortalModule} from '@angular/cdk/portal';

@NgModule({
  imports: [
    PortalModule
  ]
})
export class AlertServiceModule {
  public static forRoot(): ModuleWithProviders<AlertServiceModule> {
    return {
      ngModule: AlertServiceModule,
      providers: [
        {
          provide: ALERT_SERVICE,
          useClass: AlertService
        }
      ]
    };
  }
}
