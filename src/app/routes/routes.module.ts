import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
import { NzTreeModule } from 'ng-tree-antd';

// 首页
import { DashboardV1Component } from './index/v1/v1.component';


// 登录页
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';

// 异常页引用
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';


// 服务
import { UtilityService } from '../service/utils.service';

// 清单页面

import { LaunchApplyComponent } from './listManagement/launch-apply/launch-apply.component';
import { SubListComponent } from './listManagement/sub-list/sub-list.component';
import { AdRecordComponent } from './listManagement/ad-record/ad-record.component';

// 基础参数维护
import { SProfilesComponent } from './listManagement/UnderlyingParameter/s-profiles/s-profiles.component';
import { SProjectComponent } from './listManagement/UnderlyingParameter/s-project/s-project.component';
import { SWorkitemComponent } from './listManagement/UnderlyingParameter/s-workitem/s-workitem.component';
import { SBranchComponent } from './listManagement/UnderlyingParameter/s-branch/s-branch.component';

// 公共封装组件
import { ListComponent} from '../component/list/list.component';
import { EnvironmentComponent} from '../component/environment/environment.component';
import { ListfoldComponent } from '../component/listfold/listfold.component';
import { MergelistComponent } from '../component/mergelist/mergelist.component';



@NgModule({
    imports: [ SharedModule, RouteRoutingModule, NzTreeModule ], // 模块把feature合并成离散单元的一种方式，当应用需要模块的feature时，将其添加到imports数组中，它告诉Angular应用需要它们来正常工作。
    declarations: [ // 声明当前module控制的组件，创建的指令和管道也要添加至declarations数组中
        DashboardV1Component,
        // 登录页
        UserLoginComponent,
        // 清单页面
        LaunchApplyComponent,
        SubListComponent,
        SBranchComponent,
        AdRecordComponent,
        UserRegisterComponent,
        // 基础参数维护
        SProfilesComponent,
        SWorkitemComponent,
        SProjectComponent,
        UserRegisterResultComponent,
        // single pages
        Exception403Component,
        Exception404Component,
        Exception500Component,
        // 封装组件
        ListComponent,
        EnvironmentComponent,
        ListfoldComponent,
        MergelistComponent
    ],
    entryComponents: [],
    providers: [UtilityService], // 把服务加入到当前的模块,如果是跟模块,则可以应用于任何部分
})

export class RoutesModule {}
