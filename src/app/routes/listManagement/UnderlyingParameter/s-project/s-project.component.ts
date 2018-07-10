import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ProductModule } from '../../../../service/delivent/projectModule';
import * as _ from 'lodash';

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
        { value: '部署配置', key: 'deployConfig', isclick: false },
    ];
    modelTitle: string;


    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
        ]
    }

    test: string;
    total: number;
    pageTotal: number;
    // 枚举值
    projectType = [
        {key: '新增', value: 'add'},
        {key: '修改', value: 'exit'},
        {key: '删除', value: 'del'},
    ]


    buttons = [
        {key: 'add', value: '新建工程', if: true}
    ];



    ngOnInit() {
        this.showAdd = true;
        this.getData();
    }


    getData() {
        this.data = [
            {projectName: '测试', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试1', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试2', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试3', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试45', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试7', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试8', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试9', projectType: '新增' , deployConfig: 'json'},
            {projectName: '测试0', projectType: '新增' , deployConfig: 'json'}
        ];
        this.total = 100;
        this.pageTotal = 20;

        _.forEach(this.data , function (value) {
            value.buttonData = ['修改', '', '', '删除'];
        });
        console.log(this.data);
    }

    // 新增方法
    addHandler(event) {
        if (event === 'add') {
            this.productAdd = new ProductModule(); // 清空
            this.modalVisible = true;
            this.modelTitle = '新建工程';
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
                this.productAdd = event;
                this.modalVisible = true;
            } else if (event.names === '删除') {
                console.log('删除逻辑');
            }
        }
    }

    // 选中复选框方法
    selectedRow(event) {

    }

    save() {
        console.log(this.productAdd)
    }

}
