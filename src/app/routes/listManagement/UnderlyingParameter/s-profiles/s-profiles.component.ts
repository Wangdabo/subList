import { Component, OnInit, Inject, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
import { BranchModule} from '../../../../service/delivent/brachModule';
import { Observable, Observer } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
    selector: 'app-s-profiles',
    templateUrl: './s-profiles.component.html',
})
export class SProfilesComponent implements OnInit {
//    @ViewChild('time') private d1: ElementRef;
    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
        private fb: FormBuilder,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private confirmServ: NzModalService,
        private renderer: Renderer2
    ) {

     }
    token: any;

    profiles:SprofilesModule = new SprofilesModule();





    showAdd: boolean; // 是否有修改
    isShowTotal = true;
    configTitle = '详情'
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    isCorrelation = false;
     isCancel = false;
     assVisible = false;
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
        // { value: '环境代码', key: 'profilesCode', isclick: true},
        { value: '环境名称', key: 'profilesName', isclick: false},
        { value: 'Release分支', key: 'fullPathstr', isclick: false,title:true },
        // { value: '主机IP', key: 'hostIp', isclick: false },
        // { value: '安装路径', key: 'installPath', isclick: false },
        // { value: '版本控制用户', key: 'csvUser', isclick: false, switch:false },
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
    ]

    test: string;
    page = 1;
    total: number;
    pageTotal: number;
    branshList = [];
    branch:any;
    Ptitle:any;
    time = new Date();
     tags = [];

    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData();
        this.showAdd = true;

    }


       inputVisible = false;
       inputValue = '';
            // @ViewChild('input') input: NzInputDirectiveComponent;
            @ViewChild('input') private input: ElementRef;
            handleClose(removedTag: any): void {
                this.tags = this.tags.filter(tag => tag !== removedTag);
            }

            sliceTagName(tag: string): string {
                const isLongTag = tag.length > 20;
                return isLongTag ? `${tag.slice(0, 20)}...` : tag;
            }

            showInput(): void {
                this.inputVisible = true;
                setTimeout(() => {
                    this.input.nativeElement.focus();
                }, 10);
            }

            handleInputConfirm(): void {
                if (this.inputValue) {
                    this.tags.push(this.inputValue);
                }
                this.inputValue = '';
                this.inputVisible = false;
            }

            reset() {
                 this.search = {
                        profilesName:'',
                        manager:'',
                        isAllowDelivery:''
                    };
                    this.getData('search');
                }
            // 管理分支
            active = true;
            tabChange(obj){
               this.active = obj;
               console.log(this.active);
            }
               submitForm() {
        console.log(this.tags);
        let objarr = [];
        if (this.tags.length === 0) {
              this.nznot.create('error', '请添加打包窗口', '');
              return;
        }
        if(this.isShowIp == true){
               this.nznot.create('error', '请检查IP地址格式是否正确！', '');
              return;
        }
         if(this.isShowartf == true){
               this.nznot.create('error', '请检查ARTF格式是否正确！', '');
              return;
        }
          if(!this.profiles.artf || !this.profiles.profilesName || !this.profiles.installPath || !this.profiles.hostIp || !this.profiles.csvUser || !this.profiles.manager){
               this.nznot.create('error', '请检查信息是否完整！', '');
              return;
          }


        this.profiles.packTiming = this.tags.join(',')
        if ( ! this.profiles.guid ) {
            // this.profiles.isAllowDelivery = ' ';
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProfilesadd, this.profiles, {Authorization: this.token})
                .subscribe(
                    (val) => {


                        if (val.code === '200') {
                            this.workId = val.result.guid
                             this.mergeVisible = false;
                                this.modal.open({
                                title: '信息提示',
                                content: val.msg + '是否需要立即关联分支？',
                                okText: '确定',
                                cancelText: '取消',
                                onOk: () => {
                                    this.isCorrelation = true;
                                },
                                onCancel: () => {

                                }
                            });

                            this.nznot.create('success', val.msg, val.msg);
                        }else {
                            this.nznot.create('error', val.msg, val.msg);
                        }
                    }  ,
                (error) => {
                     this.nznot.create('error', error.msg, '');
                }
                    );
                     this.getData();
        }else{
            console.log(this.profiles)
            //   this.profiles.isAllowDelivery = ' ';
            this.utilityService.putData(appConfig.testUrl  + appConfig.API.sProfilesadd, this.profiles, {Authorization: this.token})
                .subscribe(
                    (val) => {
                        this.getData();
                        if (val.code === '200') {

                            this.mergeVisible = false;
                            this.nznot.create('success', val.msg, val.msg);
                        }else {
                            this.nznot.create('error', val.msg, val.msg);
                        }
                    } ,
                (error)=>{
                     this.nznot.create('error', error.msg, '');
                }

                );
        }





    }
    isShowDetail = false;
    branchDetali = [
        // {fullPath:''},
        //  {currVersion:''},
        //   {creater:''},
    ]
    isShowIp = false;
            checkIp(ip){
              let MOBILE_REGEXP =/^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/;
              console.log();
              if(MOBILE_REGEXP.test(ip)==true){
                      this.isShowIp = false
              }else{
                  this.isShowIp = true;
              }
            }

              isShowartf = false;
            checkArtf(event){
              let MOBILE_REGEXP =/^\+?[1-9][0-9]*$/;
              console.log(MOBILE_REGEXP.test(event));
              if(MOBILE_REGEXP.test(event)==true){
                      this.isShowartf = false
              }else{
                  this.isShowartf = true;
              }
            }
        checkBranch(branch){
            console.log(branch);
             this.isShowDetail = true
               this.utilityService.getData(appConfig.testUrl  + appConfig.API.sBranchadd+'/'+branch, {},{Authorization: this.token})
                .subscribe(
                    (val) => {
                        console.log(val)
                        if (val.code === '200') {
                            this.branchDetali = val.result;
                        }else {
                            this.nznot.create('error', val.msg , val.msg);
                        }
                    }  ,
                (error)=>{
                     this.nznot.create('error', error.msg, '');
                }
                );

            console.log(branch);
        }

    // 表格数据按钮
    buttonData = [
        {key: 'dels', value: '删除' },
        {key: 'upd', value: '修改'},
        {key: 'correlation', value: '关联分支'},


    ];
   buttonDataBranch = [
        {key: 'dels', value: '删除' },
        {key: 'upd', value: '修改'},
        {key: 'detail', value: '取消分支'},
        {key: 'branchDDetail', value: '分支详情'},
        {key: 'project', value: '拉工程'}
   ]
    branchType = [
        {key: 'feature', value: 'F',selector:false},
        {key: 'hot', value: 'H' ,selector:false},
    ]
      addBranch = {
        fullPath:'',
        branchFor:''
    };
    tabs = [
    {
      active: true,
      name  : '选择已有分支',

    },
    {
      active: false,
      name  : '新增分支',

    }
  ];

    search = {
        profilesName:'',
        manager:'',
        isAllowDelivery:''
    };
   pageIndex = 1

    getData(type?) {
           if(type == 'search'){
              this.page = 1
           }
        const page = {
             condition:this.search,
            page: {
                size: 10,
                current: this.page
            }
        };
     

        this.utilityService.postData(appConfig.testUrl  + appConfig.API.allsProfiles, page, {Authorization: this.token})
            .subscribe(
                (val) => {

                      console.log(val)
                    if (val.code === '200') {
                        this.data = val.result.records;
                        this.total = val.result.total; // 总数
                        this.pageTotal = val.result.pages * 10; // 页码
                         this.pageIndex = val.result.current;
                        for ( let i = 0; i < this.data.length; i++) {
                            this.data[i].itemName = this.data[i].fullPath
                             this.data[i].fullPathstr = this.data[i].fullPath
                            if(this.data[i].fullPath.length > 60) {
                              this.data[i].fullPathstr = appConfig.subString(this.data[i].fullPath,20)
                                }

                            if(this.data[i].fullPath === ''){
                                  this.data[i].buttonData = this.buttonData
                            }else{
                              this.data[i].buttonData = this.buttonDataBranch
                           }
                            if(this.data[i].isAllowDelivery === '1'){
                                this.data[i].isAllowDelivery = true
                            }else{
                                this.data[i].isAllowDelivery = false
                            }
                        }
                        console.log( this.data)
                    }
                    // 拼接
                },(error) => {
                      this.nznot.create('error', error.msg, '');
                }
            );
    }



    // 列表组件传过来的内容
    addHandler(event) {

        if (event === 'add') {
            this.profiles = new SprofilesModule();
            this.Ptitle = '新增运行环境';
            this.isShowIp =false;
            this.isShowartf = false
            this.tags = [];
            this.mergeVisible = true;
        } else if (event === 'checking') {
            this.modalVisible = true; // 打开核对弹出框

        } else if (event === 'export') {
            this.isVisible = true;
        } else if (event === 'ces') {
            this.isCancel = true;
            console.log(event);
            console.log('详情界面');
        }
    }



    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {



    }
    profilesGuid:any;
    branchInfo = false; // 弹出框 默认为false
    branchData: BranchModule = new BranchModule();
    branchdataInfo: boolean; // 分支详情
    tips = false;
    projectInfo = false;
prolist: any[] = [];//工程列表
// 工程穿梭框


filterOption(inputValue, option) {
    return option.description.indexOf(inputValue) > -1;
  }

  searchpro(ret: any) {
    console.log('nzSearchChange', ret);
  }

  select(ret: any) {
    console.log('nzSelectChange', ret);
  }
  subPro = []
  change(ret: any) {
     for(let i = 0 ; i < ret.list.length; i++){
         ret.list[i]['status'] =  ret.to
     }
    console.log('nzChange', ret);
  }

list = [];

workId:string;//工作项ID
    // 按钮点击事件
    buttonEvent(event) {



        this.profilesGuid = event.guid
        if (event.names.key === 'dels') { // 按钮传入删除方法

            let self = this;
            this.confirmServ.confirm({
                title  : '您是否确认要删除这项内容!',
                showConfirmLoading: true,
                onOk() {
                    self.utilityService.deleatData(appConfig.testUrl  + appConfig.API.delSprofiles + self.profilesGuid,  {Authorization: self.token})
                        .subscribe(
                            (val) => {
                                if(val.code === '200') {
                                     if ( !(( self.total - 1) % 10)) {
                                        self.pageTotal = self.pageTotal - 10 ;
                                        self.getData();
                                    }
                                    self.getData();
                                    //

                                    self.nznot.create('success', val.msg, val.msg);
                                }else {
                                    self.nznot.create('error', val.msg, '');
                                }
                            }   ,
                            (error) => {
                                 this.nznot.create('error', error.msg, '');

                            }
                        );
                },
                onCancel() {
                }
            });


        } else if(event.names.key ==='project'){

                   this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + '/' +  event.guid + '/project',  {},  {Authorization: this.token})
                            .subscribe(
                                (val) => {
                               let others = [];
                               let own = []

                                   if(val.result.others.length > 0){

                                        for(let j= 0; j < val.result.others.length;j++){
                                          val.result.others[j]['exit']='left'
                                   }
                                }
                                    if(val.result.own.length > 0){

                                   for(let j= 0; j < val.result.own.length;j++){

                                          val.result.own[j]['exit']='right'
                                   }
                                    }

                                    others = val.result.others;
                                    own = val.result.own;
                                      if(own.length > 0 && others.length > 0){
                                           others = others.concat(own)
                                    }else if(others.length == 0 && own.length > 0 ){
                                         others = own
                                    }
                               const ret = [];
                                for (let i = 0; i < others.length; i++) {
                                ret.push({
                                    key: i.toString(),
                                    title: others[i]['projectName'],
                                    guid: others[i]['guid'],
                                    status: others[i]['exit'],
                                    description: others[i]['projectName'],
                                    direction: others[i]['exit'] === 'left' ? 'left' : 'right',
                                    disabled: others[i]['exit'] === 'right'
                                });
                                }
                                this.list = ret;


                                     this.projectInfo = true
                                  console.log(this.list);

                                    // this.nznot.create('success',val.msg,val.msg);
                                    // this.getData();
                                },
                                (error) => {
                                    this.nznot.create('error', error.code , error.msg);
                                }
                            );

            } else if (event.names.key === 'upd') {
            this.Ptitle = '修改运行环境'
            this.isShowartf = false;
            let arr = [];
            event.checkOptionsOne =  this.profiles.checkOptionsOne;
            this.profiles =  _.cloneDeep(event);
            this.tags = event.packTiming.split(',')
            this.mergeVisible = true;
        }
        else if (event.names.key === 'correlation') {
            this.addBranch.branchFor = '';
            this.addBranch.fullPath = ''
            this.Ptitle = '关联分支'
            this.utilityService.getData(appConfig.testUrl  + appConfig.API.getBranch, {},{Authorization: this.token})

                .subscribe(
                    (val) => {
                        console.log(val)
                        if (val.code === '200') {
                            this.branshList = val.result
                            this.isShowDetail = false;
                            this.isCorrelation = true;
                            this.Ptitle = '关联Release分支'
                          if(this.branshList.length === 0){
                                     this.tips = true;
                          }else{
                               this.tips = false;
                          }
                          console.log(this.tips)
                              console.log(this.branshList.length)
                        }else {
                            this.nznot.create('error', val.msg, val.msg);
                        }
                    }  ,
                (error) =>{
                     this.nznot.create('error', error.msg,'');
                }
                );


        }

       else if (event.names.key  === 'branchDDetail') {
           let url= '/' + event.guid + '/branchDetail'
                this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + url ,{}, {Authorization: this.token})
                    .subscribe(
                        (val) => {
                            console.log(val);
                             this.branchInfo = true;
                             this.branchData = val.result;
                             this.branchData.createTime = moment(this.branchData.createTime).format('YYYY-MM-DD');
                        },
                        (error) => {
                             this.nznot.create('error', error.msg, '');
                        });
            }    else if (event.names.key  === 'detail') {


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
            }

    }



subProject(){
    console.log(this.list);
    let projectGuids = []
    // this.projectInfo = false;
    for(let i = 0 ; i < this.list.length; i ++){
            if(this.list[i].status == 'right'&&this.list[i].disabled == false){
            projectGuids.push(this.list[i].guid);
        }


    }

          this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProfilesadd + '/' + this.profilesGuid + '/project' ,{projectGuids:projectGuids}, {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    this.projectInfo = false;
                                    this.nznot.create('success', val.msg , val.msg);
                                    this.getData();
                                } ,
                            (error) => {
                                 this.nznot.create('error', error.msg,'');

                            }
                            );
}
// 关联分支方法

    saveCorrelation(item) {
        let url = ''
        if (item === 'C'){
            console.log(this.active);

            if(this.active == false){ //选择新增分支
                    let id =''
            if(this.addBranch.branchFor =='' || this.addBranch.fullPath == ''){
                 this.nznot.create('error', '请输入完整分支信息', '');
                 return;
            }
             if(this.workId){
                 id =this.workId
             }else{
                  id = this.profilesGuid
             };
           this.utilityService.postData(appConfig.testUrl  + appConfig.API.sProfilesadd + '/' + id + '/branch',  this.addBranch, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.getData();
                      this.isCorrelation = false;
                    this.nznot.create('success',val.msg,val.msg);
                }
                ,
                    error => {
                         this.nznot.create('error', error.msg,'');
                    }
            );
        }else{
            if(this.branch == null){
             this.nznot.create('error', '请输入完整分支信息', '');
                return;
            }
                 url = '/' + this.profilesGuid + '/branch/' +this.branch;
                 this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + url, {},{Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val)
                    if(val.code === '200') {
                        this.getData()
                        this.nznot.create('success', val.msg, val.msg);
                        this.branch = null; // 清空
                        this.isCorrelation = false;
                    }else {
                        this.nznot.create('error', val.msg, '');
                    }
                }  ,
                (error) => {
                     this.nznot.create('error', error.msg,'');
                }
            );
            }



        }else {
            url = '/' + this.profilesGuid + '/cancel';
               this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfilesadd + url, {},{Authorization: this.token})
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code === '200') {
                        this.getData()
                        this.nznot.create('success', val.msg, val.msg);
                        this.branch = null; // 清空
                        this.isCorrelation = false;
                    }else {
                        this.nznot.create('error', val.msg, '');
                    }
                }  ,
                (error) => {
                     this.nznot.create('error', error.msg, '');
                }
            );

        }


            this.branch=''
    }
    //

    // 列表按钮方法
    buttonDataHandler(event) {
        console.log(event);

    }
    // switch = false
    // switch开关方法
    getStatus(event) {
        console.log(event);
        event.switch = true
        // let isAllowDelivery = event.isAllowDelivery
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
        // console.log(obj)
        this.utilityService.putData(appConfig.testUrl  + appConfig.API.getStatus, obj,{Authorization: this.token})
            .subscribe(
                (val) => {
                     event.switch = false
                        this.getData()
                        event.isAllowDelivery = event.status
                        console.log(event)
                    if(val.code === '200') {
                        this.nznot.create('success', val.msg, val.msg);
                    }else {
                        // event.isAllowDelivery = true
                        this.nznot.create('error', val.msg, '');
                    }
                    // console.log(event)
                }   ,
                (error) => {
                       console.log(error)
                    this.nznot.create('error', error.msg, '');
                     event.switch = false;

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
    // search() {

    // }


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
        this.page = event;
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
