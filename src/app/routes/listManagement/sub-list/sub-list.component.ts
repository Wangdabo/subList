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
    appendVisible = false; // 追加弹出框 默认关闭
    launchVisible = false; // 投放详情弹出框 默认关闭
    copysplicingObj: any; // 复制的数据 用来页面展示
    copytextList: any; // 复制的数据 用来页面展示
    isGou = false; // 默认是没有勾选的
    userName: string;
    itemName: string;
    ifActive: boolean; // 是否请求成功
    copyinfos: any;

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
        for (var i = 0; i < this.workItem.length; i ++ ) {
            if (this.workItem[i].guid === event) {
                this.workItemInfo = this.workItem[i];
                this.workItemInfo.receiveTime = moment(this.workItemInfo.receiveTime).format('YYYY-MM-DD HH:mm:ss');
                this.workItemInfo.deliveryplanTime = moment(this.workItemInfo.deliveryplanTime).format('YYYY-MM-DD HH:mm:ss');
            }
        }

        this.copyinfos = _.cloneDeep(this.workItemInfo.developers);
        this.workItemInfo.copyinfos = this.copyinfos.split(',');
        this.active = true; // 打开弹框
        this.showAdd = true; // 默认没有新增

        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event + '/branchDetail', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.branchDetail = val.result.fullPath;
                    this.bransguid = val.result.guid;
                    this.ifActive = true;
                }
            );


    }


    // 整理清单
    listreset() {
        if (this.ifActive) { // 请求回来之后在打开页面
            this.reset = true;
            this.isPagination = false;
            this.itemName = _.filter(this.workItem, this.workItemInfo)[0].itemName; // 绑定工作项名称
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
                    this.textcssList = val.result;
                    let index = 0;
                    for (let i = 0; i < this.textcssList.length; i ++) {
                        if (this.textcssList[i].projectType !== 'C') { // 说明是config工程，需要让用户手动选择
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

                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray = _.cloneDeep(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployWhere.split(','));
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchType.split(',');
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray = this.arrarObj(this.textcssList[i].deliveryPatchDetails[j].fileList[n].deployArray);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray = this.arrarObj(this.textcssList[i].deliveryPatchDetails[j].fileList[n].patchArray);
                                    this.textcssList[i].deliveryPatchDetails[j].fileList[n].buttonData = ['详情'];
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


    // 调用投放环境接口
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

                }
            );
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
        this.copytextList = _.cloneDeep(this.textcssList); // 拷贝内容
        if (this.isGou) {
            this.modalVisible = true;
        } else {
            this.nznot.create('error', '请检查是否勾选工程', '请检查是否勾选工程');
        }
        // 初始化数据
        this.deliveryTime = moment(new Date()).format('YYYY-MM-DD');
        this.getcheckOptionOne();

    }

    selectedCities = [];

    // 合并投放
    checkOptionsOne = [
        { label: 'TWS改版', value: 'TWS' },
        { label: '1618 国际结算', value: '1618' },
        { label: '无纸化',  value: 'wu' }
    ]



    profiles: any;

    // 计算合计
    calculatedTotal(event) {
        let totalArray = []
        _.forEach(event , function (value) {
            if (value.projectType !== 'C') { // 如果不是默认的，代表congig和default
                if (!appConfig.isNull(value.groupArray)) { // 不为空
                    _.forEach(value.groupArray , function (value1) {
                        _.forEach(value1 , function (value2) {
                            if (!appConfig.isNull(value2.patchSelect)) {
                                let obj = {
                                    key: value2.patchSelect,
                                    total: value1.length
                                };
                                totalArray.push(obj);
                            }
                        })
                    });
                }

            } else {
                _.forEach(value.deliveryPatchDetails , function (value3) {
                    console.log(value3)
                    _.forEach(value3.fileList , function (value4) {
                        console.log(value4)
                        let obj = {
                            key: value4.patchType,
                            total: 1
                        };
                        totalArray.push(obj);
                    })
                });
            }
        });

        console.log(totalArray)
        let newArr = [];
        for (let i in totalArray) {
            if (typeof(newArr[totalArray[i].key]) === 'undefined') {
                newArr[totalArray[i].key] = 0;
            }
            newArr[totalArray[i].key] += totalArray[i].total;
        }

        console.log(newArr)
        let totalArr = [];

        for (var i in newArr) {
            console.log(i)
            let obj = {
                key: i,
                value: newArr[i]
            };
            totalArr.push(obj)
        }
        console.log(totalArr)
        return totalArr;
    }


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
                            array.push(this.textcssList[i].deliveryPatchDetails[j].fileList[n]);
                        }
                    }
                }
            }

        }

        this.splicingObj = {
            guidBranch : this.bransguid,
            dliveryAddRequest: {
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
        for ( let i = 0; i < this.splicingObj.deliveryList.length; i++) {
            if (this.splicingObj.deliveryList[i].commitType === '新增') {
                this.splicingObj.deliveryList[i].commitType = 'A';
            } else if (this.splicingObj.deliveryList[i].commitType === '删除') {
                this.splicingObj.deliveryList[i].commitType = 'D';
            }else if (this.splicingObj.deliveryList[i].commitType === '修改') {
                this.splicingObj.deliveryList[i].commitType = 'M';
            }
        }
         this.utilityService.postData(appConfig.testUrl  + appConfig.API.sDeliveryList +  '/deliveryAndDeliveryList', this.splicingObj, {Authorization: this.token})
             .map(res => res.json())
             .subscribe(
                       (val) => {
                           this.nznot.create('success', val.msg , val.msg);
                           this.infoVisible  = false;
                           this.getData();
                       }
                   );

    }

    // 追加逻辑
    testSelect= [
        {workName: '国际结算迁移', nameApplie: '国际结算上SIT', time: '2018/06/06', window: 'SIT@14:30'},
        {workName: '清单管理', nameApplie: '国际结算上UAT', time: '2018/07/06', window: 'SIT@14:30'},
        {workName: '国际结算迁移', nameApplie: '国际结算上SIT', time: '2018/07/06', window: 'SIT@14:30'},
        {workName: '国际结算迁移', nameApplie: '国际结算上SIT', time: '2018/07/06', window: 'SIT@14:30'},
    ];


    tests() {
        // this.appendVisible = true;
        this.launchVisible = true;

        this.testSelect = _.cloneDeep(this.testSelect); // 肯定是拷贝的
    };




    appendsave() {
        let submitArray = [];
        _.forEach(this.testSelect , function (select) {
            if (select.check) {
                submitArray.push(select);
            }
        })
        console.log(submitArray); // 提交给后台
        this.appendVisible = false;
    }
}



