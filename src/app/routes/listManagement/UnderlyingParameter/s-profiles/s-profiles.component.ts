import { Component, OnInit, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';



@Component({
    selector: 'app-s-profiles',
    templateUrl: './s-profiles.component.html',
})
export class SProfilesComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        private fb: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }
   token: any;
    // 打包窗口
    searchOptions = [
        {label: '9:00', value: '9:00'},
        {label: '12:00', value: '12:00'},
        {label: '15:00', value: '15:00'},
    ]

    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData();
        this.showAdd = true;

        this.validateForm = this.fb.group({
            profilesCode         : [ null, [ Validators.required ] ],
            profilesName      : [ null, [ Validators.required ] ],
            hostIp          : [ null, [ Validators.required ] ],
            installPath          : [ null, [ Validators.required ] ],
            csvUser          : [ null, [ Validators.required ] ],
            manager          : [ null, [ Validators.required ] ],
            isAllowDelivery    : [false],
            packTiming    : [ [] , [ Validators.required ]  ],
            searchOptions : [this.searchOptions],
            csvPwd    : [ null , [ Validators.required ] ]
        });
    }



    validateForm: FormGroup;

    submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }

        console.log(this.validateForm);
    }
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls[ 'password' ].value) {
            return { confirm: true, error: true };
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }
    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }


    Ptitle = '新增环境数据'
    showAdd: boolean; // 是否有修改
    isShowTotal = true;
    configTitle = '详情'
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期
    elementScice: any[] = [];
    dliveryResult = [
        {key: '0', value: '否'},
        {key: '1', value: '是'}
    ]




    data: any[] = []; // 表格数据
    headerDate = [  // 配置表头内容
        { value: '环境代码', key: 'profilesCode', isclick: true },
        { value: '环境名称', key: 'profilesName', isclick: false },
        { value: '主机IP', key: 'hostIp', isclick: false },
        { value: '安装路径', key: 'installPath', isclick: false },
        { value: '版本控制用户', key: 'csvUser', isclick: false },
        { value: '是否允许投放', key: 'isAllowDelivery', isclick: false },
        { value: '环境管理人员', key: 'manager', isclick: false },
        { value: '打包窗口', key: 'packTiming', isclick: false },
    ];

    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
            { key: 'Overview', value: '查看概况' }
        ]
    }
    buttons = [
        {key: 'add', value: '新增', if: true},
        {key: 'dels', value: '删除', if: true},
    ]

    test: string;
    page: any;
    total: number;
    pageTotal: number;

    // 表格数据按钮
    buttonData = [
        { key: 'dels', value: '删除' },
        { key: 'upd', value: '修改' }
    ];

    getData() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiles, {}, {Authorization: this.token})
            .subscribe(
                (val) => {

                    this.data = val.result;
                    for (let i = 0 ; i <  this.data.length; i ++) {
                        this.data[i].buttonData = this.buttonData;
                    }
                    console.log(this.data);
                    this.total = this.data.length; // 总数
                        // this.pageTotal = parseInt(this.data.length / 10) * 10; // 页码
                    console.log(this.data.length);
                    //

                    // 拼接
                }
            );
    }



    // 列表组件传过来的内容
    addHandler(event) {

        if (event === 'add') {
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

    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }

    // 按钮点击事件
    buttonEvent(event) {

        let obj = event.guid;

        if (event.names.key === 'dels') { // 按钮传入删除方法


            this.utilityService.deleatData(appConfig.testUrl  + appConfig.API.delSprofiles + obj, {headers: this.token})
                .subscribe(
                    (val) => {
                        console.log(val);
                    }
                );
        } else if (event.names.key === 'upd') {
            let arr = [];
           this.mergeVisible = true;
            arr = event.packTiming.split(',');
            event.searchOptions = this.searchOptions;
            event.packTiming = arr;
            // this.validateForm = event
            delete event.buttonData;
            delete event.names;
            delete event.guid;
            // event.delete('guid')
            console.log(event);
            this.validateForm.value =   event;
            console.log( this.validateForm);
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




    handleOk() {
        console.log(this.deliverItem);
        // console.log(this.checkOptionsOne); // 选中的会有true属性 判断即可
        // 请求数据 下载下来
        this.isVisible = false; // 关闭弹出框
    }


    // 合并的确定
    determine() {
        console.log('确定成功');
        this.mergeVisible = false;
    }



}
