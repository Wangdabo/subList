import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { WorkitemModule } from '../../../../service/delivent/workItemModule';
import { BranchModule} from '../../../../service/delivent/brachModule';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-s-workitem',
  templateUrl: './s-workitem.component.html',
})
export class SWorkitemComponent implements OnInit {


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

    workItem: WorkitemModule = new  WorkitemModule(); // 信息
    workAdd: WorkitemModule = new  WorkitemModule(); // 信息

    data: any[] = []; // 表格数据
    modalVisible = false; // 默认弹出框关闭
    assVisible = false; // 默认关闭
    modelTitle: string; // 默认名称
    headerDate = [  // 配置表头内容
        { value: '工作项名称', key: 'itemName', isclick: false },
        { value: '开发人员', key: 'developers', isclick: false },
        { value: '工作项负责人', key: 'owner', isclick: false },
        { value: '启动开发时间', key: 'developStartTime', isclick: false },
        { value: '计划投产时间', key: 'deliveryPlanTime', isclick: false },
        { value: '工作项状态', key: 'itemStatus', isclick: false },
    ];
    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
        ]
    }
    test: string;
    page: any;
    token: any; // token
    total: number;
    pageTotal: number;
    buttons = [
        {key: 'add', value: '新建工作项', if: true}

    ];
    assbranch: any; // 分支信息
    exitInfo: any;
    // 枚举值
    owner = [
        {key: '汪波', value: 'ljh'},
        {key: '赵春海', value: 'ljh'},
        {key: '郭培彤', value: 'ljh'},
        {key: '来哥', value: 'ljh'},
    ];

    branch: any; // 查询分支
    isEdit = false; // 默认是新增

    isShowTotal: boolean;
    branchInfo = false; // 弹出框 默认为false
    branchData: BranchModule = new BranchModule();
    branchdataInfo: boolean; // 分支详情

    ngOnInit() {
        this.showAdd = true;
        this.isShowTotal = true;
        this.branchdataInfo = false; // 默认不显示详情
        this.token  = this.tokenService.get().token; // 绑定token
        this.getData();
        this.getOper()
        this.initDate(); // 默认时间
    }
    getData() {
        this.page = {
            page: {
                current: this.workItem.pi,
                size: this.workItem.size,
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.workItemList , this.page, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.data = val.result.records;
                    this.total = val.result.total;
                    this.pageTotal = val.result.pages * 10;
                    _.forEach(this.data , function (value) {
                        if (value.itemStatus === '开发中') {
                            if (value.fullPath !== '') { // 说明存在分支
                                value.buttonData = [
                                    {key: 'upd', value: '修改'},
                                    {key: 'cenel', value: '取消'},
                                    {key: 'close', value: '取消分支'},
                                    {key: 'branchDDetail', value: '分支详情'}

                                ];
                            } else {
                                value.buttonData = [
                                    {key: 'upd', value: '修改'},
                                    {key: 'cenel', value: '取消'},
                                    {key: 'association', value: '关联分支'},
                                ];
                            }
                        }
                        value.receiveTime = moment(value.receiveTime).format('YYYY-MM-DD');
                        value.developStartTime = moment(value.developStartTime).format('YYYY-MM-DD');
                        value.deliveryTime = moment(value.deliveryTime).format('YYYY-MM-DD');
                        value.deliveryPlanTime = moment(value.deliveryPlanTime).format('YYYY-MM-DD');
                    });


                }
            );
    }
    // 查询分支
    getBranch() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.notAllot , {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                 this.branch = val.result;
                 console.log(val);
            });
    }
    // 查询人员
    getOper() {
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.svncount , {}, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.owner = val.result
                });
    }

    // 默认时间
    initDate() {
        this.workAdd.receiveTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.developStartTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.deliveryTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.deliveryPlanTime =  moment(new Date()).format('YYYY-MM-DD');
    }
    // 新增方法
    addHandler(event) {
        if (event === 'add') {
            this.workAdd = new WorkitemModule(); // 清空
            this.modalVisible = true;
            this.isEdit = false;
            this.modelTitle = '新建工作项';
        }
    }


    buttonDataHandler(event) {

    }

    // 翻页方法
    monitorHandler(event) {
        this.workItem.pi = event;
        this.page = {
            page: {
                current: event, // 页码
                size: this.workItem.size, //  每页个数
            }
        };
        this.getData();
    }


    // 按钮点击事件方法
    buttonEvent(event) {
        if (!_.isNull(event.names)) {
            if (event.names.key === 'upd') {
                this.modelTitle = '修改工程';
                this.modalVisible = true;
                this.workAdd = event;
                this.isEdit = true;

            } else if (event.names.key  === 'association') {
                this.assbranch = undefined;
                this.branchdataInfo = false;
                this.assVisible = true;
                this.exitInfo = event;
                this.getBranch();
            } else if (event.names.key  === 'close') {
                this.modal.open({
                    title: '取消关联',
                    content: '您是否确定取消关联分支?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' +  event.guid + '/cancel',  {},  {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    console.log(val)
                                    this.nznot.create('success', val.msg , val.msg);
                                    this.getData();
                                },
                                (error) => {
                                    this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });


            } else if (event.names.key  === 'branchDDetail') {
                this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event.guid + '/branchDetail' ,{}, {Authorization: this.token})
                    .subscribe(
                        (val) => {
                             this.branchInfo = true;
                             this.branchData = val.result;
                             this.branchData.createTime = moment(this.branchData.createTime).format('YYYY-MM-DD');
                        },
                        (error) => {
                            this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                        });
            } else {

                this.modal.open({
                    title: '取消工作项',
                    content: '您是否确定取消工作项?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.putData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event.guid + '/status' ,{}, {Authorization: this.token})
                            .map(res => res.json())
                            .subscribe(
                                (val) => {
                                    this.nznot.create('success', val.msg , val.msg);
                                    this.getData();
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });
            }
        }
    }

    // 选中复选框方法
    selectedRow(event) {

    }


    checkBranch(guid) {
        console.log(guid)
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sBranchadd + '/' + guid,   {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                  this.branchData = val.result;
                  this.branchdataInfo = true; // 默认不显示详情
                }
            );

    }

    // 弹出框确定
    save() {
        this.workAdd.receiveTime = moment(this.workAdd.receiveTime).format('YYYY-MM-DD');
        this.workAdd.developStartTime = moment(this.workAdd.developStartTime).format('YYYY-MM-DD');
        this.workAdd.deliveryTime = moment(this.workAdd.deliveryTime).format('YYYY-MM-DD');
        this.workAdd.deliveryPlanTime = moment(this.workAdd.deliveryPlanTime).format('YYYY-MM-DD');



        if (_.isArray(this.workAdd.developers)) {
            this.workAdd.developers = this.workAdd.developers.join( ',' );
        } else {
        }

        if (this.isEdit) { // 修改
            this.utilityService.putData(appConfig.testUrl  + appConfig.API.sWorkitem , this.workAdd, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.nznot.create('success', val.msg , val.msg);
                        this.getData();
                    },
                    error => {
                        this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                    }
                )
            ;
        } else {
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.sWorkitem, this.workAdd,  {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.nznot.create('success', val.msg , val.msg);
                        this.getData();
                    },
                    error => {
                        this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                    }
                );
        }
        this.modalVisible = false;

    }


    // 关联分支
    assSave() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + this.exitInfo.guid + '/branch/'  + this.assbranch,   {}, {Authorization: this.token})
            .timeout(5000)
            .subscribe(
                (val) => {
                    this.assVisible = false;
                    this.nznot.create('success', val.msg , val.msg);
                    this.getData();
                }
            );
    }
}
