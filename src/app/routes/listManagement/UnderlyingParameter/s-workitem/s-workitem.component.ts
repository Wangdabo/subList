import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { WorkitemModule } from '../../../../service/delivent/workItemModule';
import {ProductModule} from '../../../../service/delivent/projectModule';
import * as _ from 'lodash';

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
    modelTitle: string; // 默认名称
    headerDate = [  // 配置表头内容
        { value: '工作项名称', key: 'itemName', isclick: false },
        { value: '开发人员', key: 'developers', isclick: false },
        { value: '工作项负责人', key: 'owner', isclick: false },
        { value: '收到需求时间', key: 'receiveTime', isclick: false },
        { value: '启动开发时间', key: 'developStartTime', isclick: false },
        { value: '计划投产时间', key: 'deliveryPlanTime', isclick: false },
        { value: '实际投产时间', key: 'deliveryTime', isclick: false },
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
    total: number;
    pageTotal: number;
    buttons = [
        {key: 'add', value: '新建工作项', if: true}

    ];
    // 枚举值
    owner = [
        {key: '汪波', value: 'wb'},
        {key: '赵春海', value: 'zch'},
        {key: '郭培彤', value: 'gpt'},
        {key: '来哥', value: 'lg'},
    ];

    branch = [
        {key: '分之一', value: 'wb'},
        {key: '分之二', value: 'zch'},
        {key: '分之三', value: 'gpt'},
        {key: '分之四', value: 'lg'},
    ]
    ngOnInit() {
        this.showAdd = true;
        this.getData();
    }

    getData() {
        this.data = [
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '开发中' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '已取消' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '已投产' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '已投产' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '已取消' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '开发中' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '开发中' },
            {itemName: '测试工作项名称', developers: '李俊华', owner: '李宁', receiveTime: '2018-07-10', developStartTime: '2018-07-10', deliveryPlanTime: '2018-07-10', deliveryTime: '2018-07-10', itemStatus: '已投产' }
        ];

        this.total = 100;
        this.pageTotal = 20;

        _.forEach(this.data , function (value) {
            // 不是取消状态的话，那就加上取消按钮
            value.buttonData = ['修改', '', '', '取消'];
        });
    }

    // 新增方法
    addHandler(event) {
        if (event === 'add') {
            this.workAdd = new WorkitemModule(); // 清空
            this.modalVisible = true;
            this.modelTitle = '新建工作项';
        }
    }


    buttonDataHandler(event) {

    }

    // 翻页方法
    monitorHandler(event) {

    }


    // 按钮点击事件方法
    buttonEvent(event) {
        console.log(event)
        if (!_.isNull(event.names)) {
            if (event.names === '修改') {
                this.modelTitle = '修改工程';
                this.workAdd = event;
                this.modalVisible = true;
            } else if (event.names === '取消') {
                console.log('取消逻辑');
            }
        }
    }

    // 选中复选框方法
    selectedRow(event) {

    }






}
