import { Component, OnInit , Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { catchError, map, tap } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
    selector: 'app-launch-apply',
    templateUrl: './launch-apply.component.html',
    styleUrls: ['./launch-apply.component.less'],
})
export class LaunchApplyComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }
    token: any;
    userName: string;
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.userName = this.tokenService.get().name;
        this.getData(1);
        this.showAdd = true;
    }

    showAdd: boolean; // 是否有修改
    configTitle = '详情'
    modalVisible = false;
    checkModalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    checkListVisible = false; // 核查清单弹出
    isPagination = true; // 是否有分页
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期

    pageTotal: number; // 翻页总数
    deliveryResult = [
        {key: '0', value: '申请中'},
        {key: 'S', value: '成功'},
        {key: 'F', value: '失败'},
        {key: 'C', value: '取消投放'},
    ]

    buttons = [
        {key: 'merge', value: '合并投放', if:true},
        {key: 'checking', value: '核对合并清单',  if:false},
        {key: 'export', value: '导出投放清单',  if:true},
    ]


    data: any[] = []; // 表格数据
    mergeList: any[] = [];
    mergeListInfo: any[] = [];
    profiles: any[] = [];
    headerDate = [  // 配置表头内容
        { value: '别名', key: 'applyAlias', isclick: false, radio: false},
        { value: '工作项', key: 'guidWorkitem', isclick: true, radio: false },
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '运行环境', key: 'guidProfiles', isclick: false, radio: false },
        { value: '打包窗口', key: 'packTiming', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        { value: '程序数量', key: 'number', isclick: false, radio: false },

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
    pages: number;
    elementScice: any; // 环境数据
    branches: any[] = []; // 合并清单分支数组
    patchCount: any[] = []; // 投放小计
    detailList: any[] = []; // 合并清单代码数组
    profilesData: any;
    checkModalData: any[] = []; // 核查清单数据
    mergeListData: any[] = []; // 核查有异议的数据


        getData(index) {

        const page = {
            page : {
                size: 10,
                current : index
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.list, page, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code == 200) {
                        this.data = val.result.records;
                        console.log(this.data);
                        this.total = val.result.total; // 总数
                        this.pageTotal = val.result.pages * 10; // 页码
                        for ( let i = 0; i < this.data.length; i++) {
                            this.data[i].deliveryTime = moment(this.data[i].deliveryTime).format('YYYY-MM-DD');
                            this.data[i].guidProfiles = this.data[i].guidProfiles.target;
                            this.data[i].guidWorkitem = this.data[i].guidWorkitem.target;
                        }
                    }


                },
                (error) => {
                    console.log(error);
                }
            );

    }



    // 列表组件传过来的内容
    addHandler(event) {


        if (event === 'merge') {
            this.mergeListInfo = [];
            this.mergeList = [];
            for ( let i = 0; i < this.data.length; i++) {
                // 清空数组
                if (this.data[i].checked === true) {
                    this.mergeListInfo.push(this.data[i]);
                }
            }
            if (this.mergeListInfo.length == 0){
                this.nznot.create('error', '请检查是否勾选工程', '请检查是否勾选工程');
                return;
            }
            for ( var i = 0; i < this.mergeListInfo.length; i++) {

                if (this.mergeListInfo[0].guidProfiles != this.mergeListInfo[i].guidProfiles){
                    this.nznot.create('error', '合并项目运行环境必须一致', '合并项目运行环境必须一致');
                    return;
                }
                if (this.mergeListInfo[i].deliveryResult != '成功'){
                    this.nznot.create('error', '只能合并投放结果为成功的项目', '只能合并投放结果为成功的项目');
                    return;
                }
                this.mergeList.push(this.mergeListInfo[i].guid);
            }

            this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiles, {}, {Authorization: this.token})
                .subscribe(
                    (val) => {
                        this.mergeisVisible = true;
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


        } else if (event === 'checking') {
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
            this.checkModalVisible = true; // 打开核对弹出框


        } else if (event === 'export') {
            this.isVisible = true;
            this.workItem = false;
        } else {
            console.log(event)
            console.log('详情界面');
        }
    }

    // 列表传入的翻页数据
    monitorHandler(event) {
        this.getData(event);
    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }

    // 按钮点击事件
    buttonEvent(event) {
        // console.log(event);
        // if (event.names === '失败') {
        //     alert('失败的方法')
        // } else if (event.names === '打回') {
        //     alert('打回的方法')
        // } else if (event.names === '成功') {
        //     alert('成功的方法')
        // }

    }

    // 列表按钮方法
    buttonDataHandler(event) {

        // console.log(event);

    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
        // console.log(event);
    }


    selectedRow(event) { // 选中方法，折叠层按钮显示方法

    }


    // 搜索框
    search() {

    }


    // 比对界面
    checkVisible = false; // 默认是关闭的



    // 核对清单弹框
    environment = [
        { text: 'SIT', value: false, key: 'SIT' },
        { text: 'SIT Dev', value: false, key: 'Dev' },
        { text: 'UAT', value: false, key: 'UAT' }
    ]


    save() {
        this.modalVisible = false; // 关闭选择框
        this.checkVisible = true; // 打开核对弹出框
    }
    // 核查确定
    saveCheck() {
        let url = '';
        let profiles = '';
        let packTiming = '';
        console.log(this.elementScice)
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                profiles = this.elementScice[i].guid;
                packTiming = this.elementScice[i].times;

            }
        }
        if (profiles !== '' && packTiming !== '') {
            url = appConfig.testUrl + '/checks/profiles/' + profiles + '/packTiming/' + packTiming;
        }else {
            this.nznot.create('error', '请选择运行环境！',' 请选择运行环境！');
            return;
        }

  let index = '';
        let indexs = '';
        this.utilityService.postData( url, {}, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code === '200') {
                          this.checkListVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          this.mergeListData  = val.result.mergeLists;
                        for  (let i = 0; i < this.mergeListData.length; i ++) {
                            console.log(this.mergeListData[i].fullPath)
                            console.log(this.mergeListData[i].partOfProject)
                            if (this.mergeListData[i].fullPath) {
                                indexs = this.mergeListData[i].fullPath.indexOf(this.mergeListData[i].partOfProject);
                                this.mergeListData[i].fullPath = this.mergeListData[i].fullPath.substring(indexs, this.mergeListData[i].fullPath.length);
                                console.log(this.mergeListData[i].fullPath);
                            }
                        }
                         for  (let i = 0; i < this.checkModalData.length; i ++) {
                            for (let j = 0; j < this.checkModalData[i].detailList.length; j ++) {
                                for (let x = 0; x < this.checkModalData[i].detailList[j].deliveryPatchDetails.length; x ++) {
                                    for (let  y = 0; y < this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList.length; y ++) {
                                        if (this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath) {
                                            index = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.indexOf(this.checkModalData[i].detailList[j].projectName);
                                            this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.substring(index, this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.length);
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                ,
                (error) => {
                    console.log(error)
                    this.nznot.create('error', '异常', '异常');
                }
            );
        this.checkModalVisible = false; // 打开核对弹出框
    //
    }

    onChange(item) {
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].guid !== item && this.elementScice[i].check === true) {
                this.elementScice[i].check = false;
            }
        }

    }

    savemergeisInfo () {

        this.profiles = [];
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                let obj = {
                    guidProfiles: this.elementScice[i].guid,
                    packTiming: this.elementScice[i].times,
                    name: this.elementScice[i].manager,
                    profilesName: this.elementScice[i].profilesName
                };
                this.profiles.push(obj);
            }
        }

        if ( this.profiles.length == 0) {
            this.nznot.create('error', '请选择投放环境', '请选择投放环境');
            return;
        }
        this.deliveryTime = moment(this.deliveryTime).format('YYYY-MM-DD');
        const obj = {
            mergeList: this.mergeList,
            deliveryTime:  this.deliveryTime,
            profiles:  this.profiles

        };

        this.mergeisVisible = false;
       let index = 0;
       let kkk = '' ;

        this.utilityService.postData(appConfig.testUrl  + appConfig.API.mergeInfo, obj, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    if (val.code == 200) {
                         this.profilesData = obj;
                         this.detailList = val.result.detailList;
                         this.branches = val.result.branches;
                         this.patchCount = val.result.patchCount;
                         this.mergeisVisible = false;
                         this.mergeVisible = true;

                        for  (let i = 0; i < this.detailList.length; i ++) {
                            for (let j = 0; j < this.detailList[i].deliveryPatchDetails.length; j ++) {
                                for (let x = 0; x < this.detailList[i].deliveryPatchDetails[j].fileList.length; x ++) {
                                           if (this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath) {
                                               index = this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.indexOf(this.detailList[i].projectName);
                                               this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath = this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.substring(index, this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.length - 1);
                                           }
                                }
                            }
                        }
                     }else {
                         this.nznot.create('error', val.msg, val.msg);
                     }

                },

            )
        ;


        console.log(obj);

    }
    getdatas() {

    }


    // 状态
    returns(item , status) {
   console.log(item , status);
   let  url = appConfig.testUrl + '/checks/delivery/' + item + '/result';

        const obj = {
            result : "",
            desc : ""
        };
        this.utilityService.postData( url, {}, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val);



                }
                ,
                (error) => {
                    console.log(error)
                    this.nznot.create('error', '异常', '异常');
                }
            );

    }

    sussess() {

    }

    errors() {

    }


    // 关闭核对清单
    checkSave() {
        this.checkVisible = false;
        this.mergeVisible = false;
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.merge, this.profilesData, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code == 200) {
                        this.nznot.create('success', val.msg, val.msg);
                    }else {
                        this.nznot.create('error', val.msg, val.msg);
                    }

                },
            );
    }


    // 打印界面
    isVisible = false; // 默认关闭
    workItem = false;
    mergeisVisible = false;

    checkOptionsOne  = [
        { label: 'TWS改版', value: 'TWS' },
        { label: '1618 国际结算', value: '1618' },
        { label: '无纸化',  value: 'wu' }
    ];
    text = [
        {label: 'SIT Dev - 开发集成测试', value: 'TWS',
            time:
                [
                    {times: 'A', key: 'cd'},
                    {times: 'B',  key: 'cd'},
                    {times: 'C',  key: 'cd'}]},
        {label: '国际结算', value: '1618', time:[{times: '13:00', key: 'cs'},{times: '15:00', key: 'cs'},{times: '17:00', key: 'cs'}]},
        {label: '无纸化', value: 'wu', time:[{times: '11:00', key: 'dw'},{times: '16:00', key: 'dw'}, {times: '20:00', key: 'dw'}]},
    ];

    handleOk() {
        console.log(this.deliverItem);
        console.log(this.checkOptionsOne); // 选中的会有true属性 判断即可
        // 请求数据 下载下来
        this.isVisible = false; // 关闭弹出框
    }


    // 合并的确定
    determine() {
        console.log('确定成功');
        this.mergeVisible = false;
    }
    moreclick() {
        console.log('sssss');
    }


}
