import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';

@Component({
    selector: 'app-ad-record',
    templateUrl: './ad-record.component.html',
})
export class AdRecordComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
       @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }


   token: any;
    list: any[] = [];
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData(1);
        this.showAdd = true;

    }

    showAdd: boolean; // 是否有修改
    configTitle = '详情'
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期
    pageTotal: number;

    dliveryResult = [
        {key: '0', value: '否'},
        {key: '1', value: '是'}
    ]

    // buttons = [
    //     {key: 'merge', value: '合并投放', if:true},
    //     {key: 'checking', value: '核对合并清单',  if:false},
    //     {key: 'export', value: '导出投放清单',  if:true},
    // ]


    data: any[] = []; // 表格数据
    headerDate = [  // 配置表头内容
        { value: '别名', key: 'checkAlias', isclick: true },
        { value: '核查时间', key: 'checkDate', isclick: false },
        { value: '核查状态', key: 'checkStatus', isclick: false },
        { value: '核查人', key: 'checkUser', isclick: false },
        { value: '运行环境', key: 'guidProfiles', isclick: false },
        { value: '打包窗口', key: 'packTiming', isclick: false },
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

 // demo= [
 //     { key: '1', value: '查看概况1' },
 //     { key: '2', value: '查看概况2' },
 //     { key: '2', value: '查看概况1' },
 //     { key: '4', value: '查看概况2' },
 //     { key: '4', value: '查看概况3' },
 //     { key: '4', value: '查看概况3' },
 //     { key: '7', value: '查看概况2' },
 //
 // ]

    getData(index) {
        const page = {
            page : {
                size: 10,
                current : index
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.checklist, page, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.data = val.result.records;
                    this.data = val.result.records;
                    console.log(this.data);
                    this.total = val.result.total;//总数
                    this.pageTotal = val.result.pages * 10;//页码
                    for ( let i = 0; i < this.data.length; i++) {
                        this.data[i].checkDate = moment(this.data[i].checkDate).format('YYYY-MM-DD');
                    }


                },
            );
        // this.data = [
        //     {guidWorkitem: '1618 国际结算迁移', applyAlias:'第一次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT',proposer: '黄锡华', deliveryResult: '成功', number: 5 },
        //     {guidWorkitem: '1618 国际结算迁移', applyAlias:'第二次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT',proposer: '陈育爽', deliveryResult: '成功', number: 2 },
        //     {guidWorkitem: '柜面无纸化', applyAlias:'补充提交', deliveryTime: '2018-06-16',  guidProfiles:'SIT',proposer: '李宁', deliveryResult: '申请中', number: 3 },
        //     {guidWorkitem: '1618 国际结算迁移', applyAlias:'第一次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT',proposer: '黄锡华', deliveryResult: '成功', number: 10 },
        //     {guidWorkitem: '1618 柜面无纸化', applyAlias:'第一次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT Dev',proposer: '鲍成杰', deliveryResult: '申请中', number: 4 },
        //     {guidWorkitem: '柜面无纸化', applyAlias:'第一次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT Dev',proposer: '鲍成杰', deliveryResult: '申请中', number: 4 },
        //     {guidWorkitem: '1618 柜面无纸化', applyAlias:'第二次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT Dev',proposer: '鲍成杰', deliveryResult: '失败', number: 4 },
        //     {guidWorkitem: '1618 柜面无纸化', applyAlias:'第一次投放', deliveryTime: '2018-06-16',  guidProfiles:'SIT Dev',proposer: '鲍成杰', deliveryResult: '申请中', number: 4 },
        //     {guidWorkitem: '柜面无纸化', applyAlias:'补充提交', deliveryTime: '2018-06-16',  guidProfiles:'SIT Dev',proposer: '李宁', deliveryResult: '成功', number: 4 },
        // ]
        // for(var i =0; i< this.data.length; i++) {
        //     if (this.data[i].deliveryResult !== '成功') {
        //         // 后期根据条件判断添加
        //         this.data[i].buttonData = [ '打回','', ' ', '失败', '', ' ', '成功'];
        //     }
        // }
        // this.total = 50;
    }



    // 列表组件传过来的内容
    addHandler(event) {

        if (event === 'merge') {
            this.mergeVisible = true;
        } else if (event === 'checking') {
            this.modalVisible = true; // 打开核对弹出框
        } else if (event === 'export') {
            this.isVisible = true;
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
        console.log(event);
        if (event.names === '失败') {
            alert('失败的方法');
        } else if (event.names === '打回') {
            alert('打回的方法');
        } else if (event.names === '成功') {
            alert('成功的方法');
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



    // 状态
    returns() {

    }

    sussess() {

    }

    errors() {

    }


    // 关闭核对清单
    checkSave() {
        this.checkVisible = false;
    }


    // 打印界面
    isVisible = false; // 默认关闭
    workItem = false;

    checkOptionsOne  = [
        { label: 'TWS改版', value: 'TWS' },
        { label: '1618 国际结算', value: '1618' },
        { label: '无纸化',  value: 'wu' }
    ]


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


}
