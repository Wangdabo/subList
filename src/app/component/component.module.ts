import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './list/list.component';
import { NzTreeModule } from 'ng-tree-antd';
import { DndModule } from 'ng2-dnd';

const COMPONENT_NOROUNT = [

];

@NgModule({
  imports: [
    SharedModule,
    NzTreeModule,
    DndModule.forRoot()
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ListComponent,

  ],
  entryComponents: COMPONENT_NOROUNT
})
export class ComponentModule {

}
