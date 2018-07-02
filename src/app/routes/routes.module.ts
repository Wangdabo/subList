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
import { LaunchApplyComponent } from '../../../../subList/src/app/routes/listManagement/launch-apply/launch-apply.component';
import { SubListComponent } from '../../../../subList/src/app/routes/listManagement/sub-list/sub-list.component';

// 公共封装组件
import { ListComponent} from '../component/list/list.component';
// 拦截器组件
// import {AuthInterceptorService } from '../service/noop-interceptor';
import { NoopInterceptor} from '../service/noopServe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
    imports: [ SharedModule, RouteRoutingModule, NzTreeModule ], // 模块把特性合并成离散单元的一种方式，当应用需要模块的特性时，将其添加到imports数组中，它告诉Angular应用需要它们来正常工作。
    declarations: [ // 声明当前module控制的组件，创建的指令和管道也要添加至declarations数组中
        DashboardV1Component,
        // 登录页
        UserLoginComponent,
        // 清单页面
        LaunchApplyComponent,
        SubListComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        // single pages
        Exception403Component,
        Exception404Component,
        Exception500Component,
        // 封装组件
        ListComponent
    ],
    entryComponents: [],
    providers: [
        UtilityService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NoopInterceptor,
            multi: true,
        }
    ], // 把服务加入到当前的模块,如果是跟模块,则可以应用于任何部分
})

export class RoutesModule {}