import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ProductModule } from '../../../../service/delivent/projectModule';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-s-project',
  templateUrl: './s-project.component.html',
})
export class SProjectComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }

    isPagination = true; // 是否有分页
    showAdd: boolean; // 是否有修改
    productItem: ProductModule = new  ProductModule(); // 信息
    productAdd: ProductModule = new  ProductModule(); // 信息
    modalVisible = false; // 弹出框 默认关闭
    data: any[] = []; // 表格数据
    headerDate = [  // 配置表头内容
        { value: '工程名称', key: 'projectName', isclick: false },
        { value: '工程类型', key: 'projectType', isclick: false },
        { value: '导出到', key: 'exportShow', isclick: false },
        { value: '部署到', key: 'deployShow', isclick: false },
    ];
    modelTitle: string;
    isEdit = false;

    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
        ]
    }

    test: string;
    total: number;
    pageTotal: number;
    isShowTotal: boolean;
    // 枚举值
    projectType = [
        {key: '普通工程', value: 'C'},
        {key: '特殊工程', value: 'S'},
    ]


    buttons = [
        {key: 'add', value: '新建工程', if: true}
    ];
    token: any; // token值
    // 枚举值
    exportType: any;
    deployType: any;
    page: any;

    ngOnInit() {
        // 枚举值赋值
        this.exportType = appConfig.Enumeration.exportType;
        this.deployType = appConfig.Enumeration.deployType;
        this.token  = this.tokenService.get().token; // 绑定token
        console.log(this.productAdd)
        this.showAdd = true;
        this.isShowTotal = true;
        this.getData();
    }

    getData() {
        this.page = {
            page: {
                current: this.productItem.pi,
                size: this.productItem.size,
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProjectList , this.page, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.data = val.result.records;
                    this.total = val.result.total;
                    this.pageTotal = val.result.pages * 10;
                    _.forEach(this.data , function (value) {
                        value.buttonData = [
                            {key: 'details', value: '详情'},
                            {key: 'dels', value: '删除'},
                            {key: 'upd', value: '修改'}
                        ];
                        if (!_.isNull(value.deployConfig)) {
                            let jsonPar = JSON.parse(value.deployConfig)
                            _.forEach(jsonPar , function (json) {
                                // 先这样。如果想严谨  利用冒泡函数 两两相加即可,然后赋值
                                value.exportShow = json.exportType;
                                value.deployShow = json.deployType;
                            })
                        }
                    });


                }
            );
    }


    // 新增方法
    addHandler(event) {
        if (event === 'add') {
            this.productAdd = new ProductModule(); // 清空
            this.modalVisible = true;
            this.modelTitle = '新建工程';
            this.isEdit = false;
        }
    }



    buttonDataHandler(event) {

    }

    // 翻页方法
    monitorHandler(event) {
        this.productItem.pi = event;
        this.page = {
            page: {
                current: event, // 页码
                size: this.productItem.size, //  每页个数
            }
        };
        this.getData();
    }


    // 按钮点击事件方法
    buttonEvent(event) {
        if (event.projectType === '特殊工程') {
            event.projectType = 'S';
        } else {
            event.projectType = 'C';
        }
        if (!_.isNull(event.names)) {
            if (event.names.key === 'upd') {
                this.modelTitle = '修改工程';
                this.productAdd = event; // 修改类型问题，为什么返回给我C, 不应该是add或者 exit？

                // 避免影响 重新赋值
                this.exportType = _.cloneDeep(appConfig.Enumeration.exportType);
                this.deployType = _.cloneDeep(appConfig.Enumeration.deployType);
                // 拼接即可
                let spliarray = [];
                if (!_.isNull(event.deployConfig)) {
                    let jsonPar = JSON.parse(event.deployConfig)
                    let deployarray = this.deployType
                    let exportarray = this.exportType
                        _.forEach(jsonPar , function (json) {
                            json.deployArray = json.deployType.split(',');
                            json.exportArray = json.exportType.split(',');

                            // 匹配部署到选中
                            _.forEach(json.deployArray , function (deploy) {
                                for (let i = 0;  i < deployarray.length; i ++) {
                                    if (deploy === deployarray[i].value) {
                                        deployarray[i].checked = true;  // 选中
                                    }
                                }
                            })
                            // 匹配导出为选中
                            _.forEach(json.exportArray , function (expo) {
                                for (let i = 0;  i < exportarray.length; i ++) {
                                    if (expo === exportarray[i].value) {
                                        exportarray[i].checked = true;  // 选中
                                    }
                                }
                            })

                        })
                }
                this.modalVisible = true;
                this.isEdit = true;
            } else if (event.names.key === 'dels') { // 删除逻辑
                this.utilityService.deleatData(appConfig.testUrl  + appConfig.API.sProject + '/' + event.guid , {Authorization: this.token})
                    .map(res => res.json())
                    .subscribe(
                        (val) => {
                            this.nznot.create('success', val.msg , val.msg);
                            this.getData();
                        }
                    );
            } else {
                console.log('详情逻辑');
            }
        }
    }

    // 选中复选框方法
    selectedRow(event) {

    }

    save() {
        console.log(this.productAdd);
        let splicing  = [];
        console.log(this.exportType)
        console.log(this.deployType)

        var exportType = [];
        _.forEach(this.exportType , function (value) {
            if (value.checked) {
                exportType.push(value.label);
            }
        })

        var deployType = [];
        _.forEach(this.deployType , function (value) {
            if (value.checked) {
                deployType.push(value.label);
            }
        });
        splicing = [
            {
             exportType: exportType.join(','),
             deployType: deployType.join(',')
            }
        ]
        this.productAdd.deployConfig = JSON.stringify(splicing);
        if (this.isEdit) { // 修改
            this.utilityService.putData(appConfig.testUrl  + appConfig.API.sProject, this.productAdd, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.nznot.create('success', val.msg , val.msg);
                        this.getData();
                    }
                );
        } else {
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProject, this.productAdd, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.nznot.create('success', val.msg , val.msg);
                        this.getData();
                    }
                );
        }
        this.modalVisible = false;

    }

}
