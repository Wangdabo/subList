import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './list/list.component';
import { EnvironmentComponent} from './environment/environment.component';
import { ListfoldComponent } from './listfold/listfold.component';
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
      EnvironmentComponent,
      ListfoldComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class ComponentModule {

}
