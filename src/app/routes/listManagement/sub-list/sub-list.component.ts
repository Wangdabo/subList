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

    deliveryDesc: string; // 投放说明
    mergeilsItem: MergelistModuleergeList = new MergelistModuleergeList();
    workItem: any; // 工作组List
    workItemInfo: any; // 工作组详情
    branchDetail: any; // 分支信息

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
        this.getworkData();
    }

    // 调用初始化工作项信息
    getworkData() {
        console.log(this.token)
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
            if(this.workItem[i].guid === event) {
                this.workItemInfo = this.workItem[i];
            }
        }
        this.workItemInfo.developers = this.workItemInfo.developers.split(",")
        this.active = true; // 打开弹框
        this.showAdd = true; // 默认没有新增

        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/'+ event + '/branchDetail', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val)
                    this.branchDetail  = val.result.fullPath;
                    this.bransguid = val.result.guid;
                }
            );


    }


    // 整理清单
    listreset() {
        this.reset = true;
        this.isPagination = false;

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
        { value: '程序名称', key: 'programName', isclick: true },
        { value: '提交人', key: 'author', isclick: false },
        { value: '变动类型', key: 'commitType', isclick: false },
        { value: '当前版本', key: 'deliveryVersion', isclick: false },
        { value: '时间', key: 'commitDate', isclick: false },
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
    getData() {
        // 请求信息
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sDeliveryList + '/'+ this.bransguid + '/history', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val);
                    this.textcssList = val.result;
                    for(let i = 0; i < this.textcssList.length; i ++) {
                        /*this.textcssList[i].exportType = [
                            { label: 'jar', value: 'jar', checked: false },
                            { label: 'plugin', value: 'plugin', checked: false },
                            { label: 'ecd', value: 'ecd', checked: false },
                            { label: 'epd', value: 'epd', checked: false },
                            { label: 'war', value: 'war', checked: false },
                        ];
                        this.textcssList[i].deployToType = [
                            { label: 'tws', value: 'tws', checked: false },
                            { label: 'bs', value: 'bs', checked: false },
                            { label: 'vm', value: 'vm', checked: false },
                            { label: '数据库', value: 'mysql', checked: false },
                        ];*/
                        for (let j =0; j < this.textcssList[i].deliveryPatchDetails.length; j++) {
                            // 只有在config的时候 才需要转数组
                            // this.textcssList[i].deliveryPatchDetails[j].patchType = 'ecd,epd'
                            // this.textcssList[i].deliveryPatchDetails[j].patchType =  this.textcssList[i].deliveryPatchDetails[j].patchType.split(',');
                            console.log(this.textcssList[i].deliveryPatchDetails[j])
                            for ( let n = 0; n < this.textcssList[i].deliveryPatchDetails[j].fileList.length; n++) {
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].buttonData = ['删除', '', ' ', '详情'];
                                this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate = moment(this.textcssList[i].deliveryPatchDetails[j].fileList[n].commitDate).format('YYYY-MM-DD HH:mm:ss');
                            }
                        }
                    }
                }
            );
       /* this.textcssList = [
            {
                name: '/com.primeton.ibs.common.message',
                Active: true,
                list: [
                    {
                        exportType: [
                            { label: 'jar', value: 'jar', checked: true },
                            { label: 'plugin', value: 'plugin', checked: false },
                            { label: 'ecd', value: 'ecd', checked: false },
                            { label: 'epd', value: 'epd', checked: false },
                            { label: 'war', value: 'war', checked: false },
                        ],
                        deployToType: [
                            { label: 'tws', value: 'tws', checked: false },
                            { label: 'bs', value: 'bs', checked: false },
                            { label: 'vm', value: 'vm', checked: false },
                            { label: '数据库', value: 'mysql', checked: false },
                        ],
                        dataList: [
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl1', appType: '修改',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl2', appType: '增加',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl3', appType: '删除',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl4', appType: '删除',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl5', appType: '增加',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl6', appType: '删除',  isopen:'782 -> 820'},
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl7', appType: '修改',  isopen:'782 -> 820'},
                        ],
                    },
                    {
                        exportType: [
                            { label: 'jar', value: 'jar', checked: true },
                            { label: 'plugin', value: 'plugin', checked: true },
                            { label: 'ecd', value: 'ecd', checked: true },
                            { label: 'epd', value: 'epd', checked: true },
                            { label: 'war', value: 'war', checked: true },
                        ],
                        deployToType: [
                            { label: 'tws', value: 'tws', checked: true },
                            { label: 'bs', value: 'bs', checked: false },
                            { label: 'vm', value: 'vm', checked: false },
                            { label: '数据库', value: 'mysql', checked: false },
                        ],
                        dataList: [
                            {appName: 'com.primeton.ibs.common.message/src/com/primeton/i.../message/MessageDefinitionModelLoader.java', appCode:'shiyunl8', appType: '修改',  isopen:'782 -> 820'}
                        ],
                    }
                ],

                total: 7,
            },
        ]*/



    }
    // 列表组件传过来的内容
    addHandler(event) {
        console.log(event)
        if (event === 'merge') {
            console.log('合并投放')
        } else if (event === 'checking') {
            console.log('合并成功')
        } else if (event === 'export') {
            alert('导出成功')
        } else {
            console.log('修改界面')
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
    }

    // 列表按钮方法
    buttonDataHandler(event) {
        console.log(event)
    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
        console.log(event)
    }


    selectedRow(event) { // 选中方法，折叠层按钮显示方法

    }

    seach() {
        console.log('点我干嘛')
    }


    // 补录清单方法
    Supplementary() {
        console.log(1)
        console.log(this.textList); // 选择的会有checked属性 为true
    }


    // 投放申请
    Serve() {
        console.log(2)
        this.modalVisible = true;
    }



    selectedCities = [];

    // 合并投放
    checkOptionsOne = [
        { label: 'TWS改版', value: 'TWS' },
        { label: '1618 国际结算', value: '1618' },
        { label: '无纸化',  value: 'wu' }
    ]

    text = [
        {label: 'SIT Dev - 开发集成测试', value: 'TWS',
            time:
                [
                    {times: 'A', key: 'cd'},
                    {times: 'B',  key: 'cd'},
                    {times: 'C',  key: 'cd'}]},
        {label: '国际结算', value: '1618', time:[{times: '13:00',key: 'cs'},{times: '15:00',key: 'cs'},{times: '17:00',key: 'cs'}]},
        {label: '无纸化', value: 'wu', time:[{times: '11:00',key: 'dw'},{times: '16:00',key: 'dw'},{times: '20:00',key: 'dw'}]},
    ]


    save() {
        console.log(this.text)
        let arr = [];
        /*for(let i = 0; i < this.text.length; i ++ ) {
            let obj = {};
           if(this.text[i].check && this.text[i].check.length !== 0) {
               obj.projectId = this.text[i].check.join('');
               for( let s = 0; s < this.text[i].time.length; s ++ ) {
                   if (this.text[i].time[s].check) {
                      obj.times = this.text[i].time[s].check;
                   }
               }
               arr.push(obj)
           }
        }
        console.log(arr)*/
    }
}



