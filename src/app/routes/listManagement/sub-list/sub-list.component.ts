import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { MergelistModuleergeList} from '../../../service/delivent/mergelistModule';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
})
export class SubListComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        public settings: SettingsService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, // 依赖注入 注入token
    ) { }


    search: any;
    workItmseach: any;
    workItm = [
        {key: '001', value: '1618项目组'},
        {key: '002', value: 'TWS项目组'},
        {key: '003', value: 'RTS项目组'}
        ];

    title: '请输入工作组代码';
    active: boolean;
    reset: boolean;
    isPagination: boolean;
    textList: any;
    token: any; // 保存token信息
    bransguid: string;

    deliveryTime: any; // 投放时间
    deliveryName: string; // 投放别名
    mergeilsItem: MergelistModuleergeList = new MergelistModuleergeList();
    workItem: any; // 工作组List
    workItemInfo: any; // 工作组详情
    branchDetail: any; // 分支信息
    deleteId: string;
    splicingObj: any; //  拼接的数据
    elementScice: any; // 环境数据
    infoVisible = false; //  弹出框默认关闭
    copysplicingObj: any; // 复制的数据 用来页面展示
    copytextList: any; // 复制的数据 用来页面展示
    isGou = false; // 默认是没有勾选的
    userName: string;
    itemName: string;

    // 多选框数据
    // 导出类型
    exportType = [
        { label: 'jar', value: 'jar', checked: true },
        { label: 'plugin', value: 'plugin', checked: false },
        { label: 'ecd', value: 'ecd', checked: false },
        { label: 'epd', value: 'epd', checked: false },
        { label: 'war', value: 'war', checked: false },
    ]

    // 部署到
    deployToType = [
        { label: 'tws', value: 'tws', checked: true },
        { label: 'bs', value: 'bs', checked: false },
        { label: 'vm', value: 'vm', checked: false },
        { label: '数据库', value: 'mysql', checked: false },
    ]


    ngOnInit() {
        this.active = false;
        this.reset = false;
        this.token  = this.tokenService.get().token; // 绑定token
        this.userName  = this.tokenService.get().name; // 绑定token
        this.getworkData(); // 调用工作项信息
        this.getcheckOptionOne();
        this.copysplicingObj = {};
        this.copysplicingObj.dliveryAddRequest = {};
        this.copysplicingObj.dliveryAddRequest.profiles = [];
        this.copysplicingObj.deliveryList = [];

    }

    // 调用初始化工作项信息
    getworkData() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem, {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.workItem = val.result;
                }
            );
    }


    // 下拉框选择
    checkSelect(event) {
        console.log(event)
        for (var i = 0; i < this.workItem.length; i ++ ) {
            if (this.workItem[i].guid === event) {
                this.workItemInfo = this.workItem[i];
            }
        }
        this.workItemInfo.developers = this.workItemInfo.developers.split(',')
        this.active = true; // 打开弹框
        this.showAdd = true; // 默认没有新增

        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event + '/branchDetail', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.branchDetail  = val.result.fullPath;
                    this.bransguid = val.result.guid;
                }
            );


    }


    // 整理清单
    listreset() {
        this.reset = true;
        this.isPagination = false;
        this.itemName = _.filter(this.workItem, this.workItemInfo)[0].itemName; // 绑定工作项名称


        this.getData();
    }


    // list组件方法
    dliveryResult = [
        {key: '0', value: '申请中'},
        {key: 'S', value: '成功'},
        {key: 'F', value: '失败'},
        {key: 'C', value: '取消投放'},
    ]

    buttons = [
    ]


    data: any[] = []; // 表格数据
    showAdd: boolean;
    headerData = [  // 配置表头内容

    ];
    // 传入按钮层
    moreData = {
        morebutton: true,
        buttons: [
            { key: 'Overview', value: '查看概况' }
        ]
    }

    test: string;
    page: any;
    total: number;

    modalVisible = false; // 投放申请弹框

    textcssList: any;
    // 数组转换特定格式
    arrarObj(event) {
        let listArray = [];
        for ( let i = 0 ; i <  event.length;  i++) {
            let obj = {
                value: event[i],
                label: event[i],
            };
            listArray.push(obj);
        }
        return listArray;
    }

    getData() {
        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sDeliveryList + '/'+ this.bransguid + '/history', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.textcssList = val.result;
                    for (let i = 0; i < this.textcssList.length; i ++) {
                        if (this.textcssList[i].projectType !== 'C') { // 说明是config工程，需要让用户手动选择
                            this.textcssList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'programName', isclick: true, radio: false },
                                { value: '提交人', key: 'author', isclick: false, radio: false  },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false  },
                                { value: '当前版本', key: 'deliveryVersion', isclick: false, radio: false  },
                                { value: '时间', key: 'commitDate', isclick: false, radio: false  },
                                { value: '部署到', key: 'deployWhere', isclick: false, radio: true, type: 'deployArray' },
                                { value: '导出到', key: 'patchType', isclick: false, radio: true, type: 'patchArray'  },
                            ];
                            for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray = _.cloneDeep(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere.split(','));
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchType.split(',');
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray = this.arrarObj(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.arrarObj(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray);
                                    // this.textcssList[i].deliveryPatchDetails[j].fileList[n].buttonData = ['删除', '', ' ', '详情'];
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].buttonData = ['详情'];
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        } else {
                            this.textcssList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'programName', isclick: true, radio: false },
                                { value: '提交人', key: 'author', isclick: false, radio: false },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false },
                                { value: '当前版本', key: 'deliveryVersion', isclick: false, radio: false },
                                { value: '时间', key: 'commitDate', isclick: false, radio: false },
                            ];
                            for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].buttonData = ['详情'];
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        }

                    }
                }
            );
    }
    // 列表组件传过来的内容
    addHandler(event) {
        console.log(event)
        if (event === 'merge') {
            console.log('合并投放');
        } else if (event === 'checking') {
            console.log('合并成功');
        } else if (event === 'export') {
            alert('导出成功');
        } else {
            console.log('修改界面');
        }
    }

    // 列表传入的翻页数据
    monitorHandler(event) {

    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }

    // 按钮点击事件
    buttonEvent(event) {
        console.log(event)
        if (event.data.names === '删除') {
           /* this.deleteId = event.index;
            console.log(this.deleteId);
            event.parList.fileList.splice(this.deleteId, 1);
            console.log(event.parList.fileList);*/
        } else {
            console.log('详情');
        }

    }

    // 列表按钮方法
    buttonDataHandler(event) {
        console.log(event);
    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
        console.log(event);
    }


    selectedRow(event) { // 选中方法，折叠层按钮显示方法

    }

    seach() {
        console.log('点我干嘛');
    }


    // 补录清单方法
    Supplementary() {
        console.log(1);
    }


    // 投放申请
    Serve() {
        for (let i = 0; i < this.textcssList.length; i ++) {
            if (this.textcssList[i].projectType !== 'C') { // 说明是config工程，需要让用户手动选择
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if ( !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                               this.isGou = true;
                           }
                        } else {
                            this.isGou = false;
                        }
                    }
                }
            } else {
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            this.isGou = true;
                        } else {
                            this.isGou = false;
                        }
                        console.log(this.isGou);
                    }
                }
            }

        }
        this.copytextList = _.cloneDeep(this.textcssList); // 拷贝内容
       if (this.isGou) {
           this.modalVisible = true;
       } else {
           this.nznot.create('error', '请检查是否勾选工程', '请检查是否勾选工程');
       }

    }

    selectedCities = [];

    // 合并投放
    checkOptionsOne = [
        { label: 'TWS改版', value: 'TWS' },
        { label: '1618 国际结算', value: '1618' },
        { label: '无纸化',  value: 'wu' }
    ]


    // 合并投放接口调用
    getcheckOptionOne() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiles, {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.elementScice = val.result;
                    for (let i = 0; i < this.elementScice.length; i++) {
                        this.elementScice[i].packTiming = this.elementScice[i].packTiming.split(',');
                        this.elementScice[i].Timing  = []
                        for ( let s = 0; s < this.elementScice[i].packTiming.length; s ++) {
                            let obj = {
                                time: this.elementScice[i].packTiming[s]
                            };
                            this.elementScice[i].Timing.push(obj);
                        }
                    }
                    // 拼接
                }
            );
    }

    profiles: any;
    // 投放申请
    save() {
       this.profiles = [];
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                let obj = {
                    guidProfiles: this.elementScice[i].guid,
                    profilesName: this.elementScice[i].profilesName,
                    packTiming: this.elementScice[i].times,
                    name: this.elementScice[i].manager,
                };
                this.profiles.push(obj);
            }
        }

        if (!_.isUndefined(this.deliveryTime) && !_.isUndefined(this.deliveryName) && this.profiles.length > 0) { // 如果日期和下面的事件都选择了
            this.dataChange();
            this.infoVisible = true;

            //  处理数据用来展示, 把没有选中的删除掉
            console.log(this.copytextList)
            _.forEach(this.copytextList , function (value) { // 若一个参数，返回的便是其value值
                        console.log(value)
                    _.forEach(value.deliveryPatchDetails , function (value1) {
                        _.remove(value1.fileList, function(n) {
                            return n.checked !== true;
                        });

                      if (value.projectType !== 'C') { // 如果不是c那就代表要单独处理
                          console.log(value1.fileList);
                      }

                    });
                });

            /* this.utilityService.postData(appConfig.testUrl  + appConfig.API.sDeliveryList +  '/deliveryAnd', this.splicingObj, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.nznot.create('success', val.msg , val.msg);
                    this.modalVisible = false;
                }
            );*/
            this.modalVisible = false;
        } else {
            this.nznot.create('error', '请检查信息是否全部填写', '请检查信息是否全部填写');
        }

    }



    // 数据处理
    dataChange() {
        /*拼数据*/
        let objsss = false; // 前端判定是否正确
        let array = [];
        for (let i = 0; i < this.textcssList.length; i ++) {
            if (this.textcssList[i].projectType !== 'C') { // 说明是config工程，需要让用户手动选择
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '新增') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'A';
                            } else if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '删除') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'D';
                            }else if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '修改') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'M';
                            }
                            // if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere !== undefined && this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect !== undefined) {
                            if ( !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere = this.textcssList[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchType = this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                            }
                            // 处理转换逻辑，把radio选中的给后台
                            array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        }
                    }
                }
            } else {
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '新增') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'A';
                            } else if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '删除') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'D';
                            }else if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType === '修改') {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitType = 'M';
                            }
                            array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        }
                    }
                }
            }

        }

        this.splicingObj = {
            guidBranch : this.bransguid,
            dliveryAddRequest: {
                applyAlias: this.deliveryName,
                profiles: this.profiles,
                deliveryTime: moment(this.deliveryTime).format('YYYY-MM-DD')
            },
            deliveryList: array,
        };
        this.copysplicingObj = _.cloneDeep(this.splicingObj); // copy内容 用来页面的展示 而且需要添加数据
        // 绑定内容
        this.copysplicingObj.branchDetail = this.branchDetail; // 分支
        this.copysplicingObj.userName = this.userName; // 登陆用户名
        this.copysplicingObj.itemName = this.itemName; // 登陆用户名
    }


    subSave() {


    }
}



