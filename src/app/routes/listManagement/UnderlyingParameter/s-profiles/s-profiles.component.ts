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
import { SprofilesModule} from '../../../../service/delivent/sprofilesModule';

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
        private confirmServ: NzModalService
    ) { }
    token: any;

    profiles:SprofilesModule = new SprofilesModule();





    submitForm() {

        let arr = [];
        let objarr = [];
        this.profiles.checkOptionsOne.forEach( function (i) {
            console.log(i)
            if(i.checked == true) {
                arr.push(i.value)
            }
        })
        this.profiles.packTiming = arr.join(',')
        if ( ! this.profiles.guid ) {
            // this.profiles.isAllowDelivery = ' ';
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProfilesadd, this.profiles, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.getData();
                        if(val.code == 200) {

                            this.mergeVisible = false;

                            this.nznot.create('success', val.msg, val.msg);
                        }else {
                            this.nznot.create('error', '异常', '异常');
                        }
                    }   ,
                    (error) => {

                        this.nznot.create('error', error.json().msg,'');
                    }
                );
        }else{
            console.log(this.profiles)
            //   this.profiles.isAllowDelivery = ' ';
            this.utilityService.putData(appConfig.testUrl  + appConfig.API.sProfilesadd, this.profiles, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.getData();
                        if(val.code == 200) {

                            this.mergeVisible = false;
                            this.nznot.create('success', val.msg, val.msg);
                        }else {
                            this.nznot.create('error', '异常', '异常');
                        }
                    }   ,
                    (error) => {
                        this.nznot.create('error', '异常', '异常');
                    }

                );
        }





    }


    Ptitle: any;
    showAdd: boolean; // 是否有修改
    isShowTotal = true;
    configTitle = '详情'
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    isCorrelation = false;

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
        { value: '环境代码', key: 'profilesCode', isclick: true},
        { value: '环境名称', key: 'profilesName', isclick: false},
        { value: '主机IP', key: 'hostIp', isclick: false },
        { value: '安装路径', key: 'installPath', isclick: false },
        { value: '版本控制用户', key: 'csvUser', isclick: false, switch:false },
        { value: '是否允许投放', key: 'isAllowDelivery', isclick: false,  switch:true},
        { value: '环境管理人员', key: 'manager', isclick: false, switch:false },
        { value: '打包窗口', key: 'packTiming', isclick: false , switch:false},
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
        // {key: 'dels', value: '删除', if: true},
    ]

    test: string;
    page: any;
    total: number;
    pageTotal: number;
    branshList:any[] = [];
    branch:any;


    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData();
        this.showAdd = true;


    }


    // 表格数据按钮
    buttonData = [
        { key: 'dels', value: '删除' },
        { key: 'upd', value: '修改' },
        {key: 'correlation', value: '关联分支'},
        {key: 'detail', value: '取消分支'},
    ];
    // branchList:any[] = [];
    // getBranch() {
    //       this.utilityService.getData(appConfig.testUrl  + appConfig.API.getBranch, {}, {Authorization: this.token})
    //         .subscribe(
    //             (val) => {

    //                 this.branchList = val.result;
    //                 console.log(  this.branchList);
    //             }
    //         );


    // }

    getData() {
        const page = {
            page: {
                size: 10,
                current: this.profiles.page
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.allsProfiles, page, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {

                    if (val.code == 200) {
                        this.data = val.result.records;
                        console.log(this.data);
                        this.total = val.result.total; // 总数
                        this.pageTotal = val.result.pages * 10; // 页码
                        for ( let i = 0; i < this.data.length; i++) {
                            this.data[i].buttonData = this.buttonData
                            if(this.data[i].isAllowDelivery == '允许'){
                                this.data[i].isAllowDelivery = true
                            }else{
                                this.data[i].isAllowDelivery = false
                            }
                        }
                    }
                    // 拼接
                }
            );
    }



    // 列表组件传过来的内容
    addHandler(event) {

        if (event === 'add') {
            this.profiles = new SprofilesModule();
            this.Ptitle = '新增环境数据'

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



    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }
    profilesGuid:any;
    // 按钮点击事件
    buttonEvent(event) {


        this.profilesGuid = event.guid
        if (event.names.key === 'dels') { // 按钮传入删除方法

            let self = this;
            this.confirmServ.confirm({
                title  : '您是否确认要删除这项内容!',
                showConfirmLoading: true,
                onOk() {
                    self.utilityService.deleatData(appConfig.testUrl  + appConfig.API.delSprofiles + this.profilesGuid,  {Authorization: self.token})
                        .map(res => res.json())
                        .subscribe(
                            (val) => {
                                if(val.code == 200) {
                                    self.getData();
                                    self.nznot.create('success', val.msg, val.msg);
                                }else {
                                    self.nznot.create('error', '异常', '异常');
                                }
                            }   ,
                            (error) => {
                                self.nznot.create('error', '异常', '异常');
                            }
                        );
                },
                onCancel() {
                }
            });


        } else if (event.names.key === 'upd') {
            this.Ptitle = '修改环境数据'
            let arr = [];

            arr = event.packTiming.split(',');
            this.profiles = new SprofilesModule();
            event.checkOptionsOne =  this.profiles.checkOptionsOne;
            this.profiles = event
            arr.forEach( j=> {
                this.profiles.checkOptionsOne.forEach( function (i) {
                    if(j == i.value){
                        i.checked = true;
                    }
                })

            })
            this.mergeVisible = true;
        }
        else if (event.names.key === 'correlation') {

            this.utilityService.getData(appConfig.testUrl  + appConfig.API.getBranch, {},{Authorization: this.token})

                .subscribe(
                    (val) => {
                        console.log(val)
                        if(val.code == 200) {
                            this.branshList = val.result
                            this.isCorrelation = true;
                        }else {
                            this.nznot.create('error', '异常', '异常');
                        }
                    }   ,
                    (error) => {
                        this.nznot.create('error', '异常', '异常');
                    }
                );


        }
        else if (event.names.key === 'detail') {

            let self = this;
            this.confirmServ.confirm({
                title  : '您是否确认要取消关联分支!',
                showConfirmLoading: true,
                onOk() {
                    self.saveCorrelation('Q')
                },
                onCancel() {
                }
            });

            // this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + '/' + this.profilesGuid, {},{Authorization: this.token})
            // .subscribe(
            // (val) => {
            //   console.log(val)
            // if(val.code == 200) {
            //            this.nznot.create('success', val.msg, val.msg);
            //             this.isCorrelation = true;
            //     }
            //     }   ,
            //     (error) => {
            //         this.nznot.create('error', '异常', '异常');
            // }
            //  );
        }
        else if (event.names.key === 'detail') {

            let self = this;
            this.confirmServ.confirm({
                title  : '您是否确认要取消关联分支!',
                showConfirmLoading: true,
                onOk() {
                    self.saveCorrelation('Q')
                },
                onCancel() {
                }
            });

            // this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + '/' + this.profilesGuid, {},{Authorization: this.token})
            // .subscribe(
            // (val) => {
            //   console.log(val)
            // if(val.code == 200) {
            //            this.nznot.create('success', val.msg, val.msg);
            //             this.isCorrelation = true;
            //     }
            //     }   ,
            //     (error) => {
            //         this.nznot.create('error', '异常', '异常');
            // }
            //  );
        }

    }

// 关联分支方法
    saveCorrelation(item) {
        let url = ''
        if (item === 'C'){
            url = '/' + this.profilesGuid + '/branch/' +this.branch;
        }else {
            url = '/' + this.profilesGuid + '/cancel';
        }

        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + url, {},{Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val)
                    if(val.code == 200) {
                        this.nznot.create('success', val.msg, val.msg);
                        this.isCorrelation = false;
                    }else {
                        this.nznot.create('error', val.msg, '');
                    }
                }   ,
                (error) => {
                    this.nznot.create('error', error.json().msg, '');
                }
            );
    }
    //

    // 列表按钮方法
    buttonDataHandler(event) {
        console.log(event);

    }
    // switch开关方法
    getStatus(event) {
        let status = '';
        if(event.status === true){
            status = '1'
        }else{
            status = '0'
        }
        let obj = {
            guid: event.guid,
            isAllowDelivery: status
        }
        console.log(obj)
        this.utilityService.putData(appConfig.testUrl  + appConfig.API.getStatus, obj,{Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    if(val.code == 200) {
                        this.nznot.create('success', val.msg, val.msg);
                    }else {
                        this.nznot.create('error', val.msg, '');
                    }
                }   ,
                (error) => {
                    this.nznot.create('error', error.json().msg, '');
                }
            );


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

    // 列表传入的翻页数据
    monitorHandler(event) {
        this.profiles.page = event;
        this.getData();
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
