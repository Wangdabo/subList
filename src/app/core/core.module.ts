/*核心模块，只会导入一次。因此针对整个业务模块都需要使用的纯服务类（例如：消息、数据访问等），都应该存在这里。*/
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { I18NService } from './i18n/i18n.service';

@NgModule({
    providers: [
        I18NService
    ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
