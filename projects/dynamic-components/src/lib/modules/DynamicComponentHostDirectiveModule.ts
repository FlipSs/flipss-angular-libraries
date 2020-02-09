import {NgModule} from "@angular/core";
import {DynamicComponentHostDirective} from "../directives/DynamicComponentHostDirective";

@NgModule({
  declarations: [
    DynamicComponentHostDirective
  ],
  exports: [
    DynamicComponentHostDirective
  ]
})
export class DynamicComponentHostDirectiveModule {
}
