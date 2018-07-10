import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'app-s-branch',
    templateUrl: './s-branch.component.html'
})
export class SBranchComponent implements OnInit {
    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }
    token: any;
    showAdd = false;
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData();
        this.showAdd = false;
    }

    data: any[] = []; // 表格数据
    headerDate = [  // 配置表头内容
        { value: '分支类型', key: 'branchType', isclick: true },
        { value: '代码全路径', key: 'fullPath', isclick: false },
        { value: '创建人', key: 'creater', isclick: false },
        { value: '创建时间', key: 'create_time', isclick: false },
        { value: '分支作用说明', key: 'branchFor', isclick: false },
        { value: '分支当前版本', key: 'currVersion', isclick: false },
    ];

    getData() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sBranch, {}, {Authorization: this.token})
            .subscribe(
                (val) => {

                    // this.data = val.result;
                    console.log(val);
                    // for (let i = 0 ; i <  this.data.length; i ++) {
                    //     this.data[i].buttonData = this.buttonData;
                    // }
                    // console.log(this.data);
                    // this.total = this.data.length; // 总数
                    // // this.pageTotal = parseInt(this.data.length / 10) * 10; // 页码
                    // // 拼接
                }
            );
    }
}