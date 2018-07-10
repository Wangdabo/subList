import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';

// 首页
import { DashboardV1Component } from './index/v1/v1.component';

// 用户登录引入
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';

// 异常页面
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

// 提交清单页面

import { LaunchApplyComponent } from './listManagement/launch-apply/launch-apply.component';
import { SubListComponent } from './listManagement/sub-list/sub-list.component';
import { SProfilesComponent } from './listManagement/UnderlyingParameter/s-profiles/s-profiles.component';
import { AdRecordComponent} from './listManagement/ad-record/ad-record.component';
import { SProjectComponent } from './listManagement/UnderlyingParameter/s-project/s-project.component';
import { SWorkitemComponent } from './listManagement/UnderlyingParameter/s-workitem/s-workitem.component';
import { SBranchComponent } from './listManagement/UnderlyingParameter/s-branch/s-branch.component';




const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full' },
            { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
            { path: 'dashboard/v1', component: DashboardV1Component },
            // 投放申请路由
            { path: 'subList', component: SubListComponent },
            { path: 'launchApply', component: LaunchApplyComponent },
            { path: 'sProfiles', component: SProfilesComponent },
            { path: 'adRecord', component: AdRecordComponent },
            { path: 'sProject', component: SProjectComponent },
            { path: 'sworkItem', component: SWorkitemComponent },
            { path: 'sBranch', component: SBranchComponent },
        ]
    },
    // passport
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: UserLoginComponent },
            { path: 'register', component: UserRegisterComponent },
            { path: 'register-result', component: UserRegisterResultComponent }
        ]
    },

    // 单页不包裹Layout

    { path: '403', component: Exception403Component },
    // { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'dashboard' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule { }
