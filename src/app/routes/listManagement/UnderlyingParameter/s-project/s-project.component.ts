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

    // 部署类型

    diconArray : any;
    diconfig: any = [{
        'exportType': '' ,
        'depolySelect': [{ depoly: ''}],
        'error': false
    }];




    ngOnInit() {
        // 枚举值赋值
        this.exportType = appConfig.Enumeration.exportType;
        this.deployType = appConfig.Enumeration.deployType;
        this.token  = this.tokenService.get().token; // 绑定token
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
                    console.log(this.data)
                    _.forEach(this.data , function (value) {

                        if (!_.isUndefined(value.deployConfig)) {

                            if (value.deployConfig !== 'default') {
                                let jsonPar = JSON.parse(value.deployConfig)
                                _.forEach(jsonPar , function (json) {
                                    // 先这样。如果想严谨  利用冒泡函数 两两相加即可,然后赋值
                                    value.exportShow = json.exportType;
                                    value.deployShow = json.deployType;
                                })

                            } else {
                                value.deployShow = value.deployConfig;
                                value.exportShow = value.deployConfig;
                            }

                        }


                        value.buttonData = [
                            // {key: 'details', value: '详情'},
                            {key: 'dels', value: '删除'},
                            {key: 'upd', value: '修改'}
                        ];
                      /*  if (!_.isNull(value.deployConfig)) {
                            console.log(value)
                            let jsonPar = JSON.parse(value.deployConfig)
                            _.forEach(jsonPar , function (json) {
                                // 先这样。如果想严谨  利用冒泡函数 两两相加即可,然后赋值
                                value.exportShow = json.exportType;
                                value.deployShow = json.deployType;
                            })
                        }*/
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
            this.diconfig = [{
                'exportType': '' ,
                'depolySelect': [{ depoly: ''}],
                'error': false}
            ];
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
        if (!_.isNull(event.names)) {
            if (event.names.key === 'upd') {
                this.modelTitle = '修改工程';
                this.productAdd = event; // 修改类型问题
                if (event.projectType === '特殊工程') {
                    event.projectType = 'S';
                } else {
                    event.projectType = 'C';
                }

                console.log(event)
                if (event.deployConfig !== 'default') {
                    this.diconArray =  _.cloneDeep(JSON.parse(event.deployConfig));

                    for (let i = 0; i < this.diconArray.length; i++ ) {
                        this.diconArray[i].jsonArray = this.diconArray[i].deployType.split(','); // 字符串转数组
                        this.diconArray[i].depolySelect = [];
                        for (let j = 0; j < this.diconArray[i].jsonArray.length; j++) {
                            let obj = {
                                depoly: this.diconArray[i].jsonArray[j]
                            };
                            this.diconArray[i].depolySelect.push(obj)
                        }
                    }
                    this.diconfig = this.diconArray;
                } else {
                    console.log(event.deployConfig);
                    this. diconfig = [{
                        'exportType': event.deployConfig ,
                        'depolySelect': [{ depoly: event.deployConfig}],
                        'error': false
                    }];
                }



                this.modalVisible = true;
                this.isEdit = true;
            } else if (event.names.key === 'dels') { // 删除逻辑
                this.modal.open({
                    title: '删除工程',
                    content: '您是否确定删除该工程?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.deleatData(appConfig.testUrl  + appConfig.API.sProject + '/' + event.guid , {Authorization: this.token})
                            .map(res => res.json())
                            .subscribe(
                                (val) => {
                                    this.nznot.create('success', val.msg , val.msg);
                                    if ( !(( this.total - 1) % 10)) {
                                        this.productItem.pi -- ;
                                        this.getData();
                                    }

                                    this.getData();
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });

            } else {

            }
        }
    }

    // 选中复选框方法
    selectedRow(event) {

    }

    save() {
        let splicing  = [];
        console.log(this.diconfig)
        _.forEach(this.diconfig, function (value) {
            var arr = [];
            _.forEach(value.depolySelect, function (value1) {
                arr.push(value1.depoly);
            })
            let jsonObj = {
                exportType: value.exportType,
                deployType: arr.join(',')
            };
            splicing.push(jsonObj);
        })
        console.log(this.productAdd)
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






    addInput() {
        this.diconfig.push({ 'exportType': '' ,
                            'depolySelect': [{ depoly: ''}],
                            'error': false});
    }


    removeInput(index) {
        let i = this.diconfig.indexOf(index);
        this.diconfig.splice(i, 1);
        console.log(this.diconfig);
    }


    addChildInput(items) {
        items.push({ depoly: ''});
    }

    removeChildInput(items, s) {
        let t = items.indexOf(s);
        items.splice(t, 1);
    }


    onblur(item, index, array){
        for (let i = 0; i < array.length; i++) {
            if (index === i) continue; // 本次不判断, 否则会一直跟本次判断，一直true
            if (item.exportType === array[i].exportType) {
                item.error = true;
                return;
            }
        }
        item.error = false;
    }



}
