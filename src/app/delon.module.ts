/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/cipchk/ng-alain/issues/180
 * @delon模块导入  针对 @delon 系列的模块导入集合，默认情况下导入所有模块
 */
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { throwIfAlreadyLoaded } from '@core/module-import-guard';

// region: zorro modules

import {
    // LoggerModule,
    // NzLocaleModule,
    NzButtonModule,
    NzAlertModule,
    NzBadgeModule,
    // NzCalendarModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzGridModule,
    NzMessageModule,
    NzModalModule,
    NzNotificationModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzRadioModule,
    NzRateModule,
    NzSelectModule,
    NzSpinModule,
    NzSliderModule,
    NzSwitchModule,
    NzProgressModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzUtilModule,
    NzStepsModule,
    NzDropDownModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzRootModule,
    NzCarouselModule,
    // NzCardModule,
    NzCollapseModule,
    NzTimelineModule,
    NzToolTipModule,
    NzAvatarModule,
    NzUploadModule,
    NzTransferModule,
    // SERVICES
    NzNotificationService,
    NzMessageService
} from 'ng-zorro-antd';

// 引入zorro组件的一些控件  需要什么加什么, 添加一个穿梭框组件NzTransferModule
export const ZORROMODULES = [
    // LoggerModule,
    // NzLocaleModule,
    NzTransferModule,
    NzButtonModule,
    NzAlertModule,
    NzBadgeModule,
    // NzCalendarModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzGridModule,
    NzMessageModule,
    NzModalModule,
    NzNotificationModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzRadioModule,
    NzRateModule,
    NzSelectModule,
    NzSpinModule,
    NzSliderModule,
    NzSwitchModule,
    NzProgressModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzUtilModule,
    NzStepsModule,
    NzDropDownModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzRootModule,
    NzCarouselModule,
    // NzCardModule,
    NzCollapseModule,
    NzTimelineModule,
    NzToolTipModule,
    // NzBackTopModule,
    // NzAffixModule,
    // NzAnchorModule,
    NzAvatarModule,
    NzUploadModule
];
// endregion

// region: @delon/abc modules
import {
    AdSimpleTableModule,
    AdReuseTabModule,
    AdAvatarListModule,
    AdChartsModule,
    AdCountDownModule,
    AdDescListModule,
    AdEllipsisModule,
    AdErrorCollectModule,
    AdExceptionModule,
    AdFooterToolbarModule,
    AdGlobalFooterModule,
    AdNoticeIconModule,
    AdNumberInfoModule,
    AdProHeaderModule,
    AdResultModule,
    AdSidebarNavModule,
    AdStandardFormRowModule,
    AdTagSelectModule,
    AdTrendModule,
    AdDownFileModule,
    AdImageModule,
    AdUtilsModule,
    AdFullContentModule,
    AdXlsxModule,
    AdZipModule,
    AdNumberToChineseModule,
    AdLodopModule
} from '@delon/abc';
export const ABCMODULES = [
    AdSimpleTableModule,
    AdReuseTabModule,
    AdAvatarListModule,
    AdChartsModule,
    AdCountDownModule,
    AdDescListModule,
    AdEllipsisModule,
    AdErrorCollectModule,
    AdExceptionModule,
    AdFooterToolbarModule,
    AdGlobalFooterModule,
    AdNoticeIconModule,
    AdNumberInfoModule,
    AdProHeaderModule,
    AdResultModule,
    AdSidebarNavModule,
    AdStandardFormRowModule,
    AdTagSelectModule,
    AdTrendModule,
    AdDownFileModule,
    AdImageModule,
    AdUtilsModule,
    AdFullContentModule,
    AdXlsxModule,
    AdZipModule,
    AdNumberToChineseModule,
    AdLodopModule
];
// endregion

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgZorroAntdExtraModule } from 'ng-zorro-antd-extra';
import { AlainThemeModule } from '@delon/theme';
import { AlainAuthModule } from '@delon/auth';
// import { AlainACLModule } from '@delon/acl';
import { DelonCacheModule } from '@delon/cache';
// mock
import { DelonMockModule } from '@delon/mock';
// import * as MOCKDATA from '../../_mock';
import { environment } from '@env/environment';

const MOCKMODULE = [];
/*const MOCKMODULE = !environment.production || environment.chore === true ?
    [ DelonMockModule.forRoot({ data: MOCKDATA }) ] : [];*/

// region: global config functions

// import { SimpleTableConfig } from '@delon/abc';
// export function simpleTableConfig(): SimpleTableConfig {
//     return { ps: 20 };
// }

// endregion

@NgModule({
    imports: [
        NgZorroAntdModule.forRoot(),
        NgZorroAntdExtraModule.forRoot(),
        // theme
        AlainThemeModule.forRoot(),
        // abc
        AdErrorCollectModule.forRoot(), AdFooterToolbarModule.forRoot(), AdSidebarNavModule.forRoot(), AdDownFileModule.forRoot(), AdImageModule.forRoot(),
        AdAvatarListModule.forRoot(), AdDescListModule.forRoot(), AdEllipsisModule.forRoot(), AdExceptionModule.forRoot(), AdExceptionModule.forRoot(),
        AdNoticeIconModule.forRoot(), AdNumberInfoModule.forRoot(), AdProHeaderModule.forRoot(), AdResultModule.forRoot(), AdStandardFormRowModule.forRoot(),
        AdTagSelectModule.forRoot(), AdTrendModule.forRoot(), AdUtilsModule.forRoot(), AdChartsModule.forRoot(), AdCountDownModule.forRoot(), AdSimpleTableModule.forRoot(),
        AdReuseTabModule.forRoot(), AdFullContentModule.forRoot(), AdXlsxModule.forRoot(), AdZipModule.forRoot(), AdNumberToChineseModule.forRoot(), AdLodopModule.forRoot(),
        // auth
        AlainAuthModule.forRoot({
            // 受限于 https://github.com/cipchk/ng-alain/issues/246， 只支持字符串形式
            // ignores: [ `\\/login`, `assets\\/` ],
            login_url: `/passport/login`
        }),
        // acl
        // AlainACLModule.forRoot(),
        // cache
        DelonCacheModule.forRoot(),
        // mock
        ...MOCKMODULE,
        // TreeModule
    ]
})
export class DelonModule {
  constructor( @Optional() @SkipSelf() parentModule: DelonModule) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule');
  }

  static forRoot(): ModuleWithProviders {
      return {
          ngModule: DelonModule,
          providers: [
              // TIPS：@delon/abc 有大量的全局配置信息，例如设置所有 `simple-table` 的页码默认为 `20` 行
              // { provide: SimpleTableConfig, useFactory: simpleTableConfig }
          ]
      };
  }
}
