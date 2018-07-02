import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class ServiceModule { }
