import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { UtilityService } from '../../../service/utils.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { appConfig} from '../../../service/common';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.less' ],
    providers: [ SocialService ]
})
export class UserLoginComponent implements OnDestroy {
    form: FormGroup;
    error = '';
    type = 0;
    loading = false;

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        // 自身方法
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(1)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    // 点击提交方法
    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.password.markAsDirty();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.captcha.markAsDirty();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        const obj = {
            userId: this.userName.value,
            password : this.password.value
        };

        this.utilityService.postData(appConfig.testUrl  + appConfig.API.login, obj)
            .map(res => res.json())
            .subscribe(
                (val) => {
                    if (val.code === '200') {
                        // 清空路由复用信息
                        this.reuseTabService.clear();
                        // 设置token
                        this.tokenService.set({
                            token: val.result.token,
                            name: val.result.userInfo.svnUser,
                        });
                        this.router.navigate(['/']);
                    }
                },
                (src) => {
                    this.loading = false;
                    this.error = `账户或密码错误`;
                }
            );

    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
