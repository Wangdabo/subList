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

    loading = false;
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
    isShowTotalhead = false
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
    appendVisible = false; // 追加弹出框 默认关闭
    launchVisible = false; // 投放详情弹出框 默认关闭
    copysplicingObj: any; // 复制的数据 用来页面展示
    copytextList: any; // 复制的数据 用来页面展示
    isGou = false; // 默认是没有勾选的
    userName: string;
    itemName: string;
    ifActive: boolean; // 是否请求成功
    copyinfos: any;
    isShowTotal  = true;
    appendTitle: string; // 弹窗名称
    appendSelect: any; // 可追加的环境和方法
    selectApply = false; // 环境按钮
    stashList: any;

    initData: any;
    ngOnInit() {
        this.active = false;
        this.reset = false;
        this.token  = this.tokenService.get().token; // 绑定token
        this.userName  = this.tokenService.get().name; // 绑定token
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
                    if (val.result.length === 0) {
                        this.nznot.create('error', '暂无工作项' , '没有分配的工作项');
                    }
                }
            );
    }


    openChange() {
        this.getworkData(); // 调用工作项信息
    }

    // 下拉框选择
    checkSelect(event) {
        for (var i = 0; i < this.workItem.length; i ++ ) {
            if (this.workItem[i].guid === event) {
                this.workItemInfo = this.workItem[i];
            }
        }
        this.copyinfos = _.cloneDeep(this.workItemInfo.developers);
        this.workItemInfo.copyinfos = this.copyinfos.split(',');

        this.showAdd = true; // 默认没有新增
        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event + '/branchDetail', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.branchDetail = val.result.fullPath;
                    this.bransguid = val.result.guid;
                    this.ifActive = true;
                    this.active = true; // 显示清单整理按钮
                    this.selectApply = true; // 投放和补录按钮按钮显示
                },
                (src) => {
                    this.active = false; // 显示清单整理按钮
                    this.reset = false; // 分支信息关闭
                    this.nznot.create('error', JSON.parse(src._body).code , JSON.parse(src._body).msg);
                    this.selectApply = false; // 投放和补录按钮按钮隐藏
                }
            );
        this.getcheckOptionOne(event);
        this.reset  = false;
    }


    // 整理清单
    listreset() {
        if (this.ifActive) { // 请求回来之后在打开页面
            this.isPagination = false;
            this.itemName = this.workItemInfo.itemName; // 绑定工作项名称
            this.loading = true;
            this.getData();

        }

    }

    data: any[] = []; // 表格数据
    showAdd: boolean;
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

    calculatedArray: any; // 合计的数组

    detailInfo: any; // 投放之后的详情
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

    // 截取字符串

    getData() {
        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sDeliveryList + '/'+ this.bransguid + '/history', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val)
                    this.loading = false;
                    this.reset = true; // 打开右侧内容
                    this.textcssList = val.result.deliveryDetail;
                    this.stashList = val.result.stashDetail;
                    let index = 0;
                    // 整理出来的清单
                    for (let i = 0; i < this.textcssList.length; i ++) {
                        if (this.textcssList[i].projectType !== 'C' && this.textcssList[i].projectType !== 'I') { // 说明是config工程，需要让用户手动选择
                            this.textcssList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'fullName', isclick: true, radio: false },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false  },
                                { value: '导出为', key: 'patchType', isclick: false, radio: true, type: 'patchArray'  },
                                { value: '部署为', key: 'deployWhere', isclick: false, radio: true, type: 'deployArray' },
                            ];
                            for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    // 截取字符串
                                    index = this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.indexOf(this.textcssList[i].deliveryPatchDetails[j].fileList[n].partOfProject);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullName = this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.substring(index, this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.length);
                                    // 拿到渲染结构
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].depolyJsonArray = _.cloneDeep(JSON.parse(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere));
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchType.split(',');
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray = []; // 先等于空数组,push进去即可
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.arrarObj(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked = true; // 默认请求
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        } else {
                            this.textcssList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'fullName', isclick: true, radio: false },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false },
                            ];
                            for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    // 截取字符串
                                    index = this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.indexOf(this.textcssList[i].deliveryPatchDetails[j].fileList[n].partOfProject);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullName = this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.substring(index, this.textcssList[i].deliveryPatchDetails[j].fileList[n].fullPath.length);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked = true; // 默认请求
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        }
                    }
                    // 修改但是没提交的清单
                    for (let i = 0; i < this.stashList.length; i ++) {
                        if (this.stashList[i].projectType !== 'C' && this.stashList[i].projectType !== 'I') { // 说明是config工程，需要让用户手动选择
                            this.stashList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'fullName', isclick: true, radio: false },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false  },
                                { value: '导出为', key: 'patchType', isclick: false, radio: true, type: 'patchArray'  },
                                { value: '部署为', key: 'deployWhere', isclick: false, radio: true, type: 'deployArray' },
                            ];
                            for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    // 截取字符串
                                    index = this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.indexOf(this.stashList[i].deliveryPatchDetails[j].fileList[n].partOfProject);
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].fullName = this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.substring(index, this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.length);
                                    // 拿到渲染结构
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].depolyJsonArray = _.cloneDeep(JSON.parse(this.stashList[i].deliveryPatchDetails[j].fileList[n].deployWhere));
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.stashList[i].deliveryPatchDetails[j].fileList[n].patchType.split(',');
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].deployArray = []; // 先等于空数组,push进去即可
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.arrarObj(this.stashList[i].deliveryPatchDetails[j].fileList[n].patchArray);
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.stashList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        } else {
                            this.stashList[i].headerData = [  // 配置表头内容
                                { value: '程序名称', key: 'fullName', isclick: true, radio: false },
                                { value: '变动类型', key: 'commitType', isclick: false, radio: false },
                            ];
                            for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                                for ( let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                    // 截取字符串
                                    index = this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.indexOf(this.stashList[i].deliveryPatchDetails[j].fileList[n].partOfProject);
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].fullName = this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.substring(index, this.stashList[i].deliveryPatchDetails[j].fileList[n].fullPath.length);
                                    this.stashList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.stashList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        }
                    }
                },
                (error) => {
                    this.loading = false;
                    console.log(JSON.parse(error._body).code)
                    this.textcssList = []
                    this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                }
            );
    }

    // 按钮点击事件
    buttonEvent(event) {
        console.log(event)
        if (event.data.names === '删除') {
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

    }


    selectedRow(event) { // 选中方法，折叠层按钮显示方法

    }

    seach() {

    }


    // 补录清单方法
    Supplementary() {
    }




    // 投放申请
    Serve() {
        this.modalVisible = false;
        if (_.isUndefined(this.textcssList) || this.textcssList.length === 0) {
            this.modalVisible = true;
            // 不选清单, 禁选
            for (let i = 0; i < this.elementScice.length; i ++) {
                if (this.elementScice[i].delivered) {
                    this.elementScice[i].disabled = true;
                }
            }
        } else {
            this.modalVisible = false;
            let array = []; // 定义数组
            // 修改的判断逻辑
            for (let i = 0; i < this.textcssList.length; i ++) {
                if (this.textcssList[i].projectType !== 'C' && this.textcssList[i].projectType !== 'I') { // 说明是config或者default工程，需要让用户手动选择
                    for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                        for (let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ((this.textcssList[i].deliveryPatchDetails[j].fileList[n].deploySelect !== undefined && this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect !== undefined ) && (this.textcssList[i].deliveryPatchDetails[j].fileList[n].deploySelect !== null && this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect !== null)) {
                                    array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n])
                                }
                            }
                        }

                    }
                } else {
                    for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                        for (let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                                array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n])
                            } else {
                            }
                        }

                    }
                }
            }

            // 修改的未提交的判断逻辑
            for (let i = 0; i < this.stashList.length; i ++) {
                if (this.stashList[i].projectType !== 'C' && this.stashList[i].projectType !== 'I') { // 说明是config或者default工程，需要让用户手动选择
                    for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                        for (let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (this.stashList[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ((this.stashList[i].deliveryPatchDetails[j].fileList[n].deploySelect !== undefined && this.stashList[i].deliveryPatchDetails[j].fileList[n].patchSelect !== undefined ) && (this.stashList[i].deliveryPatchDetails[j].fileList[n].deploySelect !== null && this.stashList[i].deliveryPatchDetails[j].fileList[n].patchSelect !== null)) {
                                    array.push(this.stashList[i].deliveryPatchDetails[j].fileList[n])
                                }
                            }
                        }

                    }
                } else {
                    for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                        for (let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (this.stashList[i].deliveryPatchDetails[j].fileList[n].checked) {
                                array.push(this.stashList[i].deliveryPatchDetails[j].fileList[n])
                            } else {
                            }
                        }

                    }
                }
            }

            if (array.length > 0) {
                this.modalVisible = true;
                // 选清单, 必选
                for (let i = 0; i < this.elementScice.length; i ++) {
                    if (this.elementScice[i].delivered) {
                        this.elementScice[i].disabled = true;
                        this.elementScice[i].check = true;
                    }
                }
            } else {
                this.modalVisible = false;
                this.nznot.create('error', '请检查是否勾选导出和部署', '请检查是否勾选导出和部署');
            }
        }

        this.deliveryTime = moment(new Date()).format('YYYY-MM-DD');
    }

    selectedCities = [];


    profiles: any;


    // 数据处理
    dataChange() {
        /*拼数据*/
        let objsss = false; // 前端判定是否正确
        let array = []; // 选中的
        let noarray = []; // 未选中的
        // 修改的判断
        if (!_.isUndefined(this.textcssList)) { // 是否存在
            let cloneText = _.cloneDeep(this.textcssList);
            for (let i = 0; i < cloneText.length; i ++) {
                if (cloneText[i].projectType === 'C' || cloneText[i].projectType === 'I' ) { // 说明是config工程，需要让用户手动选择
                    for (let j = 0; j < cloneText[i].deliveryPatchDetails.length; j++) {
                        for ( let n = 0; n < cloneText[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (cloneText[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ( !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere = cloneText[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].patchType = cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                                }
                                // 处理转换逻辑，把radio选中的给后台
                                array.push(cloneText[i].deliveryPatchDetails[j].fileList[n]);
                            } else {
                                noarray.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                            }
                        }
                    }
                } else {
                    for (let j = 0; j < cloneText[i].deliveryPatchDetails.length; j++) {
                        for ( let n = 0; n < cloneText[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (cloneText[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ( !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere = cloneText[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].patchType = cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                                }
                                array.push(cloneText[i].deliveryPatchDetails[j].fileList[n]);
                            } else {
                                noarray.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                            }
                        }
                    }
                }

            }
        }
        // 未提交的判断
        if (!_.isUndefined(this.stashList)) { // 是否存在
            let cloneText = _.cloneDeep(this.stashList);
            for (let i = 0; i < cloneText.length; i ++) {
                if (cloneText[i].projectType === 'C' || cloneText[i].projectType === 'I' ) { // 说明是config工程，需要让用户手动选择
                    for (let j = 0; j < cloneText[i].deliveryPatchDetails.length; j++) {
                        for ( let n = 0; n < cloneText[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (cloneText[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ( !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere = cloneText[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].patchType = cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                                }
                                // 处理转换逻辑，把radio选中的给后台
                                array.push(cloneText[i].deliveryPatchDetails[j].fileList[n]);
                            } else {
                                noarray.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                            }
                        }
                    }
                } else {
                    for (let j = 0; j < cloneText[i].deliveryPatchDetails.length; j++) {
                        for ( let n = 0; n < cloneText[i].deliveryPatchDetails[j].fileList.length; n++) {
                            if (cloneText[i].deliveryPatchDetails[j].fileList[n].checked) {
                                if ( !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].deployWhere = cloneText[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                    cloneText[i].deliveryPatchDetails[j].fileList[n].patchType = cloneText[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                                }
                                array.push(cloneText[i].deliveryPatchDetails[j].fileList[n]);
                            } else {
                                noarray.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                            }
                        }
                    }
                }

            }
        }



        this.splicingObj = {
            guidBranch : this.bransguid,
            dliveryAddRequest: {
                profiles: this.profiles,
            },
            guidWorkitem: this.workItemInfo.guid,
            deliveryList: array,
            stashList: noarray
        };
    }

    // 投放申请
    save() {
        /* this.profiles = [];
      for (let i = 0; i < this.elementScice.length; i ++) {
          if (this.elementScice[i].check && this.elementScice[i].times) {
              let obj = {
                  guidProfiles: this.elementScice[i].guid,
                  profilesName: this.elementScice[i].profilesName,
                  packTiming: this.elementScice[i].times,
                  name: this.elementScice[i].manager,
                  applyAlias: this.elementScice[i].deliveryName
              };
              this.profiles.push(obj);
          }
      }
      console.log(this.profiles)
      // 第一次相同的
      var fildNewList = [];
      var filsNewList = [];
      // 完全相同
      var deploySelect; // 导出
      console.log(this.deliveryName)
      if (!_.isUndefined(this.deliveryTime)  && this.profiles.length > 0) { // 如果日期和下面的事件都选择了
          this.infoVisible = true;
          //  处理数据用来展示, 把没有选中的删除掉
          _.forEach(this.copytextList , function (value, index) { // 若一个参数，返回的便是其value值
              _.forEach(value.deliveryPatchDetails , function (value1) {
                  _.remove(value1.fileList, function(n) {
                      return n.checked !== true;
                  });
                  if (value.projectType === 'D') {
                      var alldArray = [];
                      var twodNewList;
                      for ( let i = 0; i < value1.fileList.length; i ++) {
                          twodNewList = value1.fileList[i].patchSelect; // jar  部署类型
                          fildNewList[twodNewList] = fildNewList[twodNewList] || (fildNewList[twodNewList] = []); // 断裂 如果前面是false。那就执行后面的，就相当于判断filNewList[twoNewList]是否是undefined
                          fildNewList[twodNewList].push(value1.fileList[i]);
                      }
                      for (let key in fildNewList) {
                          var obj = [];
                          for (let s = 0; s < fildNewList[key].length; s++) {
                              deploySelect = fildNewList[key][s].deploySelect; // 拿到了每一项
                              obj[deploySelect] = obj[deploySelect] || ( obj[deploySelect] = []);
                              obj[deploySelect].push(fildNewList[key][s]);
                          }
                          for (let k in obj) {
                              alldArray.push(obj[k]);
                          }
                      }
                      value.groupArray = alldArray;
                  } else if (value.projectType === 'S') {
                      var  allsArray = [];
                      var twosNewList;
                      var filst;
                      for ( let i = 0; i < value1.fileList.length; i ++) {
                          twosNewList = value1.fileList[i].patchSelect; // jar  部署类型
                          filsNewList[twosNewList] = filsNewList[twosNewList] || (filsNewList[twosNewList] = []); // 断裂 如果前面是false。那就执行后面的，就相当于判断filNewList[twoNewList]是否是undefined
                          filsNewList[twosNewList].push(value1.fileList[i]);
                      }
                      for (let key in filsNewList) {
                          var obj = [];
                          for (let s = 0; s < filsNewList[key].length; s++) {
                              deploySelect = filsNewList[key][s].deploySelect; // 拿到了每一项
                              obj[deploySelect] = obj[deploySelect] || ( obj[deploySelect] = []);
                              obj[deploySelect].push(filsNewList[key][s]);
                          }
                          for (let k in obj) {
                              allsArray.push(obj[k]); // 我拼成的数组 目前我是直接等于
                          }
                      }
                      value.groupArray = allsArray;
                  }
              });
          });
          // 合计计算
          this.calculatedArray = this.calculatedTotal(this.copytextList);
          this.modalVisible = false;
          this.infoVisible = true;
          this.dataChange();
      } else {
          this.nznot.create('error', '请检查信息是否全部填写', '请检查信息是否全部填写');
      }*/

        this.profiles = [];
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                if (_.isUndefined(this.elementScice[i].deliveryName)) { // 如果是undefined, 那么就给一个默认的别名
                    let obj = {
                        guidProfiles: this.elementScice[i].guidProfile,
                        profilesName: this.elementScice[i].profilesName,
                        packTiming: this.elementScice[i].times,
                        name: this.elementScice[i].manager,
                        applyAlias: this.workItemInfo.itemName, // 默认别名 工作项名称
                        deliveryTime: moment(this.elementScice[i].deliveryTime).format('YYYY-MM-DD')
                    };
                    this.profiles.push(obj);
                } else {
                    let obj = {
                        guidProfiles: this.elementScice[i].guidProfile,
                        profilesName: this.elementScice[i].profilesName,
                        packTiming: this.elementScice[i].times,
                        name: this.elementScice[i].manager,
                        applyAlias: this.elementScice[i].deliveryName,
                        deliveryTime: moment(this.elementScice[i].deliveryTime).format('YYYY-MM-DD')
                    };
                    this.profiles.push(obj);
                }

            }
        }
        this.dataChange();
        // 枚举值改变
        for ( let i = 0; i < this.splicingObj.deliveryList.length; i++) {
            if (this.splicingObj.deliveryList[i].commitType === '新增') {
                this.splicingObj.deliveryList[i].commitType = 'A';
            } else if (this.splicingObj.deliveryList[i].commitType === '删除') {
                this.splicingObj.deliveryList[i].commitType = 'D';
            }else if (this.splicingObj.deliveryList[i].commitType === '修改') {
                this.splicingObj.deliveryList[i].commitType = 'M';
            }

            if (this.splicingObj.deliveryList[i].fromType === '手动补录') {
                this.splicingObj.deliveryList[i].fromType = 'A';
            } else if (this.splicingObj.deliveryList[i].fromType === '分支提交') {
                this.splicingObj.deliveryList[i].fromType = 'B';
            }else if (this.splicingObj.deliveryList[i].fromType === '标准清单') {
                this.splicingObj.deliveryList[i].fromType = 'S';
            } else {
                this.splicingObj.deliveryList[i].fromType = 'M';
            }
        }
        for ( let i = 0; i < this.splicingObj.stashList.length; i++) {
            if (this.splicingObj.stashList[i].commitType === '新增') {
                this.splicingObj.stashList[i].commitType = 'A';
            } else if (this.splicingObj.stashList[i].commitType === '删除') {
                this.splicingObj.stashList[i].commitType = 'D';
            }else if (this.splicingObj.stashList[i].commitType === '修改') {
                this.splicingObj.stashList[i].commitType = 'M';
            }

            if (this.splicingObj.stashList[i].fromType === '手动补录') {
                this.splicingObj.stashList[i].fromType = 'A';
            } else if (this.splicingObj.stashList[i].fromType === '分支提交') {
                this.splicingObj.stashList[i].fromType = 'B';
            }else if (this.splicingObj.stashList[i].fromType === '标准清单') {
                this.splicingObj.stashList[i].fromType = 'S';
            } else {
                this.splicingObj.stashList[i].fromType = 'M';
            }
        }
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.sDeliveryList +  '/deliveryAndDeliveryList', this.splicingObj, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (suc) => {
                    this.nznot.create('success', suc.code , suc.msg);
                    this.detailInfo = suc.result;
                    this.appendTitle = '投放成功';
                    this.modalVisible = false; // 关闭
                    this.launchVisible  = true; // 显示详情
                    this.getData();
                    this.reset = false;
                    this.textcssList = [];
                },
                (error) => {
                    this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                    // this.getData();
                }
            );
    }

    subSave() {
    }

    // 追加代码逻辑
    appendSave() {
        for (let i = 0; i < this.textcssList.length; i ++) {
            if (this.textcssList[i].projectType !== 'C' && this.textcssList[i].projectType !== 'I' ) { // 说明是config工程，需要让用户手动选择
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if ( !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                this.isGou = true;
                            }
                        }
                    }
                }
            } else {
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            this.isGou = true;
                        }
                    }
                }
            }

        }
        if (this.isGou) {
            this.utilityService.getData(appConfig.testUrl  + '/deliveries/' +  + this.workItemInfo.guid + '/addTo', {}, {Authorization: this.token})
                .subscribe(
                    (val) => {
                        this.appendSelect = val.result;
                        if (this.appendSelect.length > 0 ) {
                            this.appendVisible = true;
                        } else {
                            this.nznot.create('error', '没有可追加的清单', '没有可追加的清单');
                        }

                    }
                );

        } else {
            this.nznot.create('error', '请检查是否勾选工程', '请检查是否勾选工程');
        }

    }



    appendsave() {
        let submitArray = [];
        _.forEach(this.appendSelect , function (select) {
            if (select.check) {
                submitArray.push(select.guid); // guid 集合
            }
        })
        let array = []; // 选中的
        let noarray = []; // 未选中的
        // 修改的
        for (let i = 0; i < this.textcssList.length; i ++) {
            if (this.textcssList[i].projectType !== 'C' && this.textcssList[i].projectType !== 'I') { // 说明是config工程，需要让用户手动选择
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if ( !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere = this.textcssList[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchType = this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                            }
                            // 处理转换逻辑，把radio选中的给后台
                            array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        } else {
                            noarray.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        }

                    }
                }
            } else {
                for (let j = 0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.textcssList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        } else {
                            noarray.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        }
                    }
                }
            }

        }
        // 修改未提交的
        for (let i = 0; i < this.stashList.length; i ++) {
            if (this.stashList[i].projectType !== 'C' && this.stashList[i].projectType !== 'I') { // 说明是config工程，需要让用户手动选择
                for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.stashList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            if ( !_.isUndefined(this.stashList[i].deliveryPatchDetails[j].fileList[n].deployWhere) && !_.isUndefined(this.stashList[i].deliveryPatchDetails[j].fileList[n].patchSelect)) {
                                this.stashList[i].deliveryPatchDetails[j].fileList[n].deployWhere = this.stashList[i].deliveryPatchDetails[j].fileList[n].deploySelect;
                                this.stashList[i].deliveryPatchDetails[j].fileList[n].patchType = this.stashList[i].deliveryPatchDetails[j].fileList[n].patchSelect;
                            }
                            // 处理转换逻辑，把radio选中的给后台
                            array.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                        } else {
                            noarray.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                        }

                    }
                }
            } else {
                for (let j = 0; j < this.stashList[i].deliveryPatchDetails.length; j++) {
                    for ( let n = 0; n < this.stashList[i].deliveryPatchDetails[j].fileList.length; n++) {
                        if (this.stashList[i].deliveryPatchDetails[j].fileList[n].checked) {
                            array.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                        } else {
                            noarray.push(this.stashList[i].deliveryPatchDetails[j].fileList[n]);
                        }
                    }
                }
            }

        }
        this.splicingObj = {
            guidDelivery: submitArray, // guid 集合
            deliveryList: array,
            stashList: noarray,
            guidWorkitem: this.workItemInfo.guid,
        };

        for ( let i = 0; i < this.splicingObj.deliveryList.length; i++) {
            if (this.splicingObj.deliveryList[i].commitType === '新增') {
                this.splicingObj.deliveryList[i].commitType = 'A';
            } else if (this.splicingObj.deliveryList[i].commitType === '删除') {
                this.splicingObj.deliveryList[i].commitType = 'D';
            }else if (this.splicingObj.deliveryList[i].commitType === '修改') {
                this.splicingObj.deliveryList[i].commitType = 'M';
            }

            if (this.splicingObj.deliveryList[i].fromType === '手动补录') {
                this.splicingObj.deliveryList[i].fromType = 'A';
            } else if (this.splicingObj.deliveryList[i].fromType === '分支提交') {
                this.splicingObj.deliveryList[i].fromType = 'B';
            }else if (this.splicingObj.deliveryList[i].fromType === '标准清单') {
                this.splicingObj.deliveryList[i].fromType = 'S';
            } else {
                this.splicingObj.deliveryList[i].fromType = 'M';
            }
        }
        for ( let i = 0; i < this.splicingObj.stashList.length; i++) {
            if (this.splicingObj.stashList[i].commitType === '新增') {
                this.splicingObj.stashList[i].commitType = 'A';
            } else if (this.splicingObj.stashList[i].commitType === '删除') {
                this.splicingObj.stashList[i].commitType = 'D';
            }else if (this.splicingObj.stashList[i].commitType === '修改') {
                this.splicingObj.stashList[i].commitType = 'M';
            }

            if (this.splicingObj.stashList[i].fromType === '手动补录') {
                this.splicingObj.stashList[i].fromType = 'A';
            } else if (this.splicingObj.stashList[i].fromType === '分支提交') {
                this.splicingObj.stashList[i].fromType = 'B';
            }else if (this.splicingObj.stashList[i].fromType === '标准清单') {
                this.splicingObj.stashList[i].fromType = 'S';
            } else {
                this.splicingObj.stashList[i].fromType = 'M';
            }
        }
        this.utilityService.postData(appConfig.testUrl  + '/sDeliveryList/superadditionDeliverylist', this.splicingObj, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.nznot.create('success', val.code , val.msg);
                    this.appendTitle = '追加成功';
                    this.detailInfo = val.result; // 返回的数据有问题
                    this.appendVisible = false;
                    this.reset = false;
                    this.getData();
                    this.launchVisible = true; // 查看追加详情
                }
            );
    }


    // 调用投放环境接口
    getcheckOptionOne(guid) {
         this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiless + '/' + guid + '/delivered', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                        this.elementScice = val.result;
                        for (let i = 0; i < this.elementScice.length; i++) {
                            this.elementScice[i].deliveryTime = new Date(this.elementScice[i].deliveryTime); // 初始化时间
                            this.elementScice[i].unixTime = moment(this.elementScice[i].deliveryTime).format('YYYY-MM-DD 00:00:00.000')
                            for (let s = 0; s < this.elementScice[i].packTimeDetails.length; s ++) {
                                if (this.elementScice[i].packTimeDetails[s].isOptions === 'D') {
                                    this.elementScice[i].times = this.elementScice[i].packTimeDetails[s].packTime;
                                }
                            }
                        }
                    localStorage.setItem('name', JSON.stringify(_.cloneDeep(this.elementScice)));
                    }
                 );
    }

    // 日期禁选方法
   /* disabledDate(current: Date): boolean {
        let array = JSON.parse(localStorage.getItem('name'));
        let index = this.nzPlaceHolder;
        let arrays = array[this.nzPlaceHolder];

        let bol: boolean;
        for ( let i = 0; i < array.length; i++) {
            if (i === index) {
                if(current.getTime() < (new Date(array[i].unixTime).getTime()) {
                    bol = true;
                } else {
                    bol = false;
                }

            }
            // return  current.getTime() < (new Date(array[i].unixTime).getTime());  // 跟默认的时间比，如果小于禁选
            // return  current.getTime() < (new Date(array[i].unixTime).getTime());  // 跟默认的时间比，如果小于禁选
        }



   /!*     if (array) {
            for ( let i = 0; i < array.length; i++) {
                if (i === index) {
                    return  current.getTime() < (new Date(array[i].unixTime).getTime());  // 跟默认的时间比，如果小于禁选
                }
               // return  current.getTime() < (array[i].deliveryTime - 24 * 60 * 60 * 1000);  // 跟默认的时间比，如果小于禁选
               // return  current.getTime() < (new Date(array[i].unixTime).getTime()  -  24 * 60 * 60 * 1000 );  // 跟默认的时间比，如果小于禁选
               /!* if (current.getTime() - new Date(array[i].unixTime).getTime() === 0) {
                    return true; // 禁选
                }
                return false;*!/
            }
        }*!/
    }*/




    // 比较时间
    onChange(time, array) {
        console.log(time)
        if (time.getTime() !== new Date(array.unixTime).getTime()) {
           for (let i = 0; i < array.packTimeDetails.length; i++) {
               if (array.packTimeDetails[i].isOptions === 'N') {
                   array.packTimeDetails[i].isOptions = 'No';
               }
           }
        } else {
            for (let i = 0; i < array.packTimeDetails.length; i++) {
                if (array.packTimeDetails[i].isOptions === 'No') {
                    array.packTimeDetails[i].isOptions = 'N';
                }
            }
        }

        if (time.getTime() < new Date(array.unixTime).getTime()) {
            array.deliveryTime = new Date(array.unixTime).getTime();
            this.nznot.create('error', '选择时间不能小于初始时间' , '');
        } else {
        }
    }



}



