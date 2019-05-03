import {ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {PortalModule} from '@angular/cdk/portal';
import {AlertComponent} from '../components/AlertComponent';
import {ALERT_SERVICE} from '../models/IAlertService';
import {AlertService} from '../internal/AlertService';

@NgModule({
  imports: [
    PortalModule
  ]
})
export class AlertServiceModule {
  public static forRoot(components: Type<AlertComponent<any, any>>[]): ModuleWithProviders<AlertServiceModule> {
    return {
      ngModule: AlertServiceModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: components,
          multi: true
        },
        {
          provide: ALERT_SERVICE,
          useClass: AlertService
        }
      ]
    };
  }
}
