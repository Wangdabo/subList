import { Component, OnInit , Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ResponseContentType } from '@angular/http';
import * as $ from 'jquery';

import * as moment from 'moment';
import * as _ from 'lodash';
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
       private confirmServ: NzModalService,

        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }
    token: any;
    userName: string;
    isNext = true;
    initDate:any;
      elementScice: any; // 环境数据
    elementCopy: any; // copy环境接口

    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.userName = this.tokenService.get().name;
        this.getElement();
        this.getData();
        this.showAdd = true;
    }
    loadingnext =false;
    showAdd: boolean; // 是否有修改
    isStatus = true;
    configTitle = '详情'
    modalVisible = false;
    checkModalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    checkListVisible = false; // 核查清单弹出
    isPagination = true; // 是否有分页
    istextVisible = false;
    isMergeList = false; // 合并列表模态框
    checkloading = true;
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期
    isShowTotal = true;
    pageTotal: number; // 翻页总数
    checkStatus = true;
    copyseniorGuid: string;
    deliveryResult = [
        {key: '0', value: '申请中',color:'skyblue'},
        {key: 'M', value: '已合并',color:'orange'},
        {key: 'C', value: '核对中',color:'orange'},
        {key: 'S', value: '核对成功',color:'green'},
        {key: 'F', value: '核对失败',color:'red'},
        {key: 'D', value: '投放成功',color:'green'},
    ]
    buttons = [
        // {key: 'merge', value: '合并投放', if: true},
        {key: 'checking', value: '去核对',  if: false},
        {key: 'export', value: '导出投放清单',  if: true},
    ]


    data: any[] = []; // 表格数据
    mergeList: any[] = [];
    mergeListInfo: any[] = [];
    profiles: any[] = [];
    updEnvironment = false;

    headerDate = [  // 配置表头内容
        { value: '别名', key: 'applyAlias', isclick: false, radio: false},
        { value: '工作项', key: 'guidWorkitem', isclick: false, radio: false },
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '运行环境', key: 'guidProfiles', isclick: false, radio: false },
        { value: '打包窗口', key: 'packTiming', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        { value: '投放类型', key: 'deliveryType', isclick: false, radio: false },
        // { value: '程序数量', key: 'number', isclick: false, radio: false },

    ];

     mergeHeader = [  // 配置表头内容

        { value: '工作项', key: 'guidWorkitem', isclick: false, radio: false },
        { value: '分支', key: 'branch', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放申请(别名)', key: 'applyAlias', isclick: false, radio: false },
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        // { value: '申请类型', key: 'deliveryType', isclick: false, radio: false },
    ];




    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
            { key: 'Overview', value: '查看概况' }
        ]
    }

    buttonData = [
        {key: 'details', value: '详情'},
        // {check: false, value: '未确认合并'},

    ];

    test: string;
    page: any;
    total: number;
    pages: number;

    branches: any[] = []; // 合并清单分支数组
    patchCount: any[] = []; // 投放小计
    detailList: any[] = []; // 合并清单代码数组
    profilesData: any;
    checkModalData: any[] = []; // 核查清单数据
    mergeListData: any[] = []; // 核查有异议的数据
    isShowDate = false;
    detailVisible = false;
    copyVisible = false;
    launchVisible = false;
    detailInfo: any; // 投放之后的详情
    copyTitle: string;
     currentpage = 1;
    inputValue = '';
    mergeListDetail:any[]=[] //投放申请详情
    pageIndex: 1;
   search = {
        guidWorkitem:'',
        proposer:'',
        deliveryResult:'',
        guidProfiles:''
    };
        getData(type?) {

           if(type == 'search'){
               this.currentpage = 1
           }
            const page = {
                condition: this.search,
                page : {
                    size: 10,
                    current :  this.currentpage,
                    orderByField: 'guid',
                    asc: false // asc 默认是true  升序排序，时间类型 用false， 降序
                }
            };
            let button =[
                 {key:'dels',value:'删除' },
                 {key:'detail',value:'详情'},

                       ]
              let buttonupd =[
                 {key:'dels',value:'删除' },
                 {key:'detail',value:'详情'},
                 {key:'upd',value:'修改'},
                 {key:'copy',value:'投放新环境'},
                       ]

            let buttonsuccess =[
                {key:'detail',value:'详情'},
            ]
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.list, page, { Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {

                        if (val.code == 200) {
                            this.data = val.result.records;
                            this.total = val.result.total; // 总数
                            this.pageTotal = val.result.pages * 10; // 页码
                            this.pageIndex = val.result.current;
                            for ( let i = 0; i < this.data.length; i++) {
                                this.data[i].deliveryTime = moment(this.data[i].deliveryTime).format('YYYY-MM-DD');
                                this.data[i].profilesGuid = this.data[i].guidProfiles.source;
                                this.data[i].guidProfiles = this.data[i].guidProfiles.target;
                                this.data[i].workGuid = this.data[i].guidWorkitem.source;
                                this.data[i].guidWorkitem = this.data[i].guidWorkitem.target;

                                if(this.data[i].deliveryResult == '申请中'){
                                     this.data[i].buttonData = buttonupd
                                } else if(this.data[i].deliveryResult == '投放成功') {
                                    this.data[i].buttonData = buttonsuccess
                                } else{
                                    this.data[i].buttonData = button
                                }

                            }
                        }


                    },
                    (error)=>{
                     if(error){
                        this.nznot.create('error', error.json().msg,'');
                        }
                }
                );

    }
    reset(){
         this.search = {
        guidWorkitem:'',
        proposer:'',
        deliveryResult:'',
        guidProfiles:''
    };
    this.getData();
    }

getElement() {
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
                    },(error)=>{
                        if(error){
                          this.nznot.create('error', error.json().msg,'');
                          }
                    }
                );
}

    // 调用投放环境接口
    getcheckOptionOne(guid) {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.copyProfiless + '/' + guid + '/delivered', {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.elementCopy = val.result;
                    for (let i = 0; i < this.elementCopy.length; i++) {
                        this.elementCopy[i].deliveryName = '第一次投放'
                        this.elementCopy[i].deliveryTime = new Date(this.elementCopy[i].deliveryTime); // 初始化时间
                        this.elementCopy[i].unixTime = moment(this.elementCopy[i].deliveryTime).format('YYYY-MM-DD 00:00:00.000')
                        if (this.elementCopy[i].delivered) { // 如果为true，那么checkbox即radio全部禁选
                            console.log(this.elementCopy[i].delivered)
                            this.elementCopy[i].disabled = true;
                        }
                        for (let s = 0; s < this.elementCopy[i].packTimeDetails.length; s ++) {
                            if (this.elementCopy[i].packTimeDetails[s].isOptions === 'D') {
                                this.elementCopy[i].times = this.elementCopy[i].packTimeDetails[s].packTime;
                            }
                        }

                    }
                    console.log( this.elementCopy )
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
             this.mergeisVisible = true;



        } else if (event === 'checking') {
            this.loadingnext = false
              this.getSprofiles();
              this.mergeisVisible = true
              this.current = 0;


            // this.changeContent();
            // this.checkModalVisible = true; // 打开核对弹出框

        } else if (event === 'export') {
            this.deliveryTime = moment(new Date()).format('YYYY-MM-DD');
            this.isVisible = true;
            this.importCurrent = 0;
            this.getSprofiles(); // 查询环境和时间
            this.workItem = false;
        } else {


        }
    }

    // 列表传入的翻页数据
    monitorHandler(event) {
      this.currentpage = event;
        this.getData();
    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }


    getSprofiles() {
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

                        },(error)=>{
                            if(error){
                          this.nznot.create('error', error.json().msg,'');
                                 }
                        }
                    );
    }
    // changeloadingnext(){
    //     this.loadingnext = false;
    // }

  checkId:any;
    current = 0;

    loading:any;
    index = 'First-content';

    pre(): void {
          this.current -= 1;
          this.changeContent();
    }

    next(): void {
        this.loadingnext = true;
        // this.current = 0;
        let profiles = '';
        let packTiming = '';
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                profiles = this.elementScice[i].guid;
                packTiming = this.elementScice[i].times;

            }
        }

        let url = '';
        if (profiles !== '' && packTiming !== '') {
            url = appConfig.testUrl + '/checks/profiles/' + profiles + '/packTiming/' + packTiming;
          }else {
            this.nznot.create('error', '请选择运行环境！', '请选择运行环境！');
              this.loadingnext = false;
            return;
        }

        if(this.current == 0) {
         let index = '';
        let indexs = '';
        //   this.current += 1;
          let arr = [];
        this.loading = true;

        // 跳转核对列表
        this.utilityService.getData( url, {}, {Authorization: this.token})
            // .map(res => res.json())
            .subscribe(
                (val) => {
                       this.loading = false;
                      this.loadingnext = false;

                    if (val.code === '200') {

                       this.current += 1;

                          for(let i = 0;i<val.result.length;i++){
                               arr[i]=val.result[i].delivery
                            arr[i]['branch']=val.result[i].branch
                            arr[i]['projectList'] = val.result[i].projectList;
                            arr[i]['expand'] =false;
                            arr[i]['check'] = true;
                             arr[i]['deliveryTime'] = moment(val.result[i].deliveryTime).format('YYYY-MM-DD');
                             if(val.result[i].delivery.deliveryResult === "申请中"){
                                  arr[i]['buttonData']= [ {check: false, value: '未确认合并'}];
                            }else{
                                   arr[i]['buttonData']= [ {check: true, value: '已确认合并'}];
                            }
                            arr[i]['guidWorkitem'] = val.result[i].delivery.guidWorkitem.target;
                          }

                        this.initDate = arr;


                                }else{
                                    this.nznot.create('error',val.msg,val.msg);

                                }
                            },
                            (error) => {

                                 this.loadingnext = false;
                                if(error){
                                    let msg = error.json();
                                     this.nznot.create('error', msg.msg, '');
                                }
                                //
                            })
                            // step2
                   }else if(this.current == 1){

                    let flage = true;
                    for (let i = 0; i < this.initDate.length; i++) {
                        if(this.initDate[i].buttonData[0].check == false) {
                            flage = false;
                            this.nznot.create('error','请确认去合并！！','');
                             return;
                        }
                    }

                    if( flage == true ) {

                           let index = '';
                             let indexs = '';

            this.utilityService.postData(url, {}, {Authorization: this.token})
                        .map(res => res.json())
                         .subscribe(
                         (val) => {
                              this.loadingnext = false;
                             this.checkId = val.result.check.guid;
                               this.checkloading = false;
                            this.current += 1;
                         this.checkListVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          this.mergeListData  = val.result.mergeLists;
                           let star = '';
                          let end = '';
                        for  (let i = 0; i < this.mergeListData.length; i ++) {
                              if(this.mergeListData[i].confirmStatus=='加入投放'){
                                this.mergeListData[i]['checkbuttons'] = true;
                            }else{
                                this.mergeListData[i]['checkbuttons'] = false;
                            }
                            if (this.mergeListData[i].fullPath) {

                                indexs = this.mergeListData[i].fullPath.indexOf(this.mergeListData[i].partOfProject);
                                this.mergeListData[i].fullPath = this.mergeListData[i].fullPath.substring(indexs, this.mergeListData[i].fullPath.length);
                        if(this.mergeListData[i].fullPath.length > 40){
                                                        star = this.mergeListData[i].fullPath.substr(0,20)
                                                        end = this.mergeListData[i].fullPath.substr(this.mergeListData[i].fullPath.length - 20)
                                                           this.mergeListData[i].fullPathstr = star + '...' + end;
                                                        }else{
                                                            this.mergeListData[i].fullPathstr =this.mergeListData[i].fullPath
                                                     }
                         }
                           if(this.mergeListData[i].programName.length > 40){
                                                        star = this.mergeListData[i].programName.substr(0,10)
                                                        end = this.mergeListData[i].programName.substr(this.mergeListData[i].programName.length - 10)
                                                           this.mergeListData[i].programNamestr = star + '...' + end;
                                                        }else{
                                                            this.mergeListData[i].programNamestr =this.mergeListData[i].programName
                                                     }
                        }

                     for  (let i = 0; i < this.checkModalData.length; i ++) {
                                      let obj = {
                                  guid:this.checkModalData[i].delivery.guid,
                                  guidWorkitem:this.checkModalData[i].delivery.guidWorkitem.target
                              }
                                    //   this.guidprent[i]['guid']=this.checkModalData[i].delivery.guid;
                                    //   this.guidprent[i]['guidWorkitem']=this.checkModalData[i].delivery.guidWorkitem.target
                              this.guidprent.push(obj);
                            //   if(  this.checkModalData[i].delivery.deliveryResult =='核对成功' || this.checkModalData[i].delivery.deliveryResult =='核对失败' ){
                            //               this.checkModalData[i].delivery.disabledS = true;
                            //          }else{
                                         this.checkModalData[i].delivery.disabledS = false;
                            //          }
                            for (let j = 0; j < this.checkModalData[i].detailList.length; j ++) {
                                for (let x = 0; x < this.checkModalData[i].detailList[j].deliveryPatchDetails.length; x ++) {
                                    for (let  y = 0; y < this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList.length; y ++) {
                                           this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y]['buttons'] = null
                                        if (this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath) {
                                            index = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.indexOf(this.checkModalData[i].detailList[j].projectName);
                                            this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.substring(index, this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.length);
                                             if(this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.length > 80){
                                                        star = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.substr(0,20)
                                                        end = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.substr(this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.length - 20)
                                                            this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPathstr = star + '...' + end;
                                                        }else{
                                                           this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPathstr =this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath
                                                     }

                              }
                                    }
                                }
                            }
                        }

                                }
                                ,(error)=>{
                                     this.loadingnext = false;
                                  if(error){
                                   this.nznot.create('error', error.json().msg,'');
                                      }
                                })
                    }


                   }



    }

    done(): void {

    }

    changeContent(): void {
        switch (this.current) {
            case 0: {
               this.getSprofiles();
                break;
            }
            case 1: {
                this.index = '<h2>顶顶顶顶</h1>';
                break;
            }
            case 2: {
                this.index = '<h3>顶顶顶顶</h1>';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

   hide(){

   }

   buttonEventMerge(event){

      let url =appConfig.testUrl + '/deliveries/'+event.guid+'/merge'
        this.utilityService.putData( url, {}, {Authorization: this.token})
           .map(res => res.json())
           .subscribe(
               (val) => {
                   if (val.code == 200){
                       event.event.check = true
                       event.event.value = '已确认合并'
                       this.loadingnext = false;
                    //    this.istextVisible = false;
                    //    this.detailVisible = false;
                       this.nznot.create('success', val.msg, val.msg);
                   }else{
                         this.nznot.create('error', val.msg,'');
                  }

               }
               ,
               (error) => {

                  if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
               }
           );



   }
  updPackTiming = {}
  guidDelivery :any;
    // 按钮点击事件
    buttonEventlist(event) {

        if(event.names.key == 'dels'){
         let self = this;
            this.confirmServ.confirm({
                title  : '您是否确认要删除这项内容!',
                showConfirmLoading: true,
                onOk() {
                    self.utilityService.deleatData(appConfig.testUrl  + appConfig.API.deliveries + '/' + event.guid ,  {Authorization: self.token})
                        .map(res => res.json())
                        .subscribe(
                            (val) => {
                                if(val.code == 200) {
                                     if ( !(( self.total - 1) % 10)) {
                                        self.pageTotal = self.pageTotal - 10 ;
                                        self.getData();
                                    }
                                    self.getData();

                                    self.nznot.create('success', val.msg, val.msg);
                                }else {
                                    self.nznot.create('error',val.msg,'');
                                }
                            }   ,
                            (error) => {
                                if(error){
                                       self.nznot.create('error',error.json().msg,'');
                                }

                            }
                        );
                },
                onCancel() {
                }
            });

        }else if(event.names.key == 'detail'){
            let star = '';
            let end = '';
        this.utilityService.getData( appConfig.testUrl + appConfig.API.deliveries + '/' + event.guid + '/deliveryLists', {}, {Authorization: this.token})
                // .map(res => res.json())
            .subscribe(
                (val) => {
                   if(val.code == 200){
                        this.mergeListDetail = val.result
                        this.mergeVisible = true;
                   }
                },(error)=>{

                    // if(error){
                    //     this.nznot.create('error',error.json().msg,'');
                    // }
                });


        }else if(event.names.key == 'upd'){

        this.guidDelivery = event.guid;
         this.utilityService.getData( appConfig.testUrl +'/deliveries/'+event.guid + '/profileDateilVerify', {}, {Authorization: this.token})
            .subscribe(
                (val) => {

                   if(val.code == 200){
                       this.updPackTiming  = val.result
                      this.updPackTiming['unixTime'] = moment(this.updPackTiming['deliveryTime']).format('YYYY-MM-DD 00:00:00.000')
                       localStorage.setItem('time',this.updPackTiming['unixTime']);
                      for(let i =0;i<this.updPackTiming['packTimeDetails'].length;i++){

                          if(this.updPackTiming['packTimeDetails'][i]['isOptions']=='D'){
                            //  this.updPackTiming['packTimeDetails'][i]['check'] = true
                             this.updPackTiming['packTiming']   =   this.updPackTiming['packTimeDetails'][i]['packTime']
                          }else{
                                //  this.updPackTiming['packTimeDetails'][i]['check'] = false
                          }
                      }
                       this.updPackTiming['deliveryTime'] = new Date(this.updPackTiming['deliveryTime']);
                           this.updEnvironment = true;
                   }

                },(error)=>{

                    if(error){
                        this.nznot.create('error', error.json().msg, '');
                    }
                });
        } else if (event.names.key === 'copy') {
            this.copyseniorGuid = event.guid;
            this.getcheckOptionOne(event.workGuid);


           /* this.utilityService.putData( appConfig.testUrl + appConfig.API.newProfiles, {}, {Authorization: this.token})
            .map(res => res.json())
                .subscribe(
                    (val) => {
                       console.log(val);
                    },
                    (error) => {
                        if(error){
                            this.nznot.create('error', error.json().msg, '');
                        }
                    });*/

            this.copyVisible = true;
        }




    }
      _disabledDate(current: Date): boolean {
        let time = localStorage.getItem('time');
    return current && current.getTime() < new Date(time).getTime();
  }
    onChange(updPackTiming) {
        if (updPackTiming.deliveryTime.getTime() !== new Date(updPackTiming.unixTime).getTime()) {
           for (let i = 0; i < updPackTiming.packTimeDetails.length; i++) {
               if (updPackTiming.packTimeDetails[i].isOptions === 'N') {
                   updPackTiming.packTimeDetails[i].isOptions = 'No';
               }
           }
        } else {
            for (let i = 0; i < updPackTiming.packTimeDetails.length; i++) {
                if (updPackTiming.packTimeDetails[i].isOptions === 'No') {
                    updPackTiming.packTimeDetails[i].isOptions = 'N';
                }
            }

        }
    }
    submitUpd(){
        let obj ={
            guidDelivery:this.guidDelivery,
            deliveryTime:this.updPackTiming['deliveryTime'],
            packTiming:this.updPackTiming['packTiming']
        }


          this.utilityService.putData( appConfig.testUrl +'/deliveries/deliveryTimePackTime', obj, {Authorization: this.token})
            .subscribe(
                (val) => {
                       this.updEnvironment = false;
                    this.getData();
                   if(val.code == 200){
                           this.nznot.create('success',val.msg,'');
                   }

                },(error)=>{

                    if(error){
                        this.nznot.create('error',error.json().msg,'');
                    }
                });
    }

    // 列表按钮方法
    buttonDataHandler(event) {



    }

    buttonEventmerge(event) {

    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
       if (event) {
            this.isNext = false;
       }

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
    // 核查确定
    saveCheck(url) {
     let index = '';
        let indexs = '';
        this.utilityService.postData( url, {}, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {

                    if (val.code === '200') {
                          this.checkListVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          this.mergeListData  = val.result.mergeLists;
                        for  (let i = 0; i < this.mergeListData.length; i ++) {
                            if (this.mergeListData[i].fullPath) {
                                indexs = this.mergeListData[i].fullPath.indexOf(this.mergeListData[i].partOfProject);
                                this.mergeListData[i].fullPath = this.mergeListData[i].fullPath.substring(indexs, this.mergeListData[i].fullPath.length);
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

                    }else{
                           this.nznot.create('error', val.msg, val.msg);
                    }
                }
                ,
                (error) => {
                   if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
            );
        this.checkModalVisible = false; // 打开核对弹出框
    //
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
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.mergeInfo, obj, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    if (val.code == 200) {


                     }else {
                         this.nznot.create('error', val.msg, val.msg);
                     }

                },
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }


            )
        ;

    }
    getdatas() {

    }
    guid: any;

    // 状态
    returns(item , S ) {

   if ( S === 0) {
       this.guid = item;

       this.istextVisible = true;

   }else {
       let  url = appConfig.testUrl + '/checks/delivery/' + item + '/result';
       if (S === 1) {
           S = 'S';
       }else {
           S = 'F';
       }
       const obj = {
               result : S,
               desc : this.inputValue
       };


       this.utilityService.postData( url, obj, {Authorization: this.token})
           .map(res => res.json())
           .subscribe(
               (val) => {
                   if (val.code == 200){
                       this.istextVisible = false;
                       this.checkListVisible = false;
                       this.nznot.create('success', val.msg, val.msg);
                   }else{
                         this.nznot.create('error', val.msg,'');
                  }
           }
               ,
               (error) => {
                  if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
               }
           );
   }


    }

    sussess(item , status) {

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

                    if (val.code == 200) {

                        this.nznot.create('success', val.msg, val.msg);
                    }else {
                        this.nznot.create('error', val.msg, val.msg);
                    }

                },
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
            );
    }



//子组件核对详情的方法
    iStouchan = false;
    idcheck:any
    mergeId :any;
    mergeguid:any
    guidprent=[ {
           guid:'',
           guidWorkitem:''
              } ]
     mergeData: any[] = []; // 核查有异议的数据
    buttonClick(event){
            let type = event.index;
            let id = event.id;
            let soyin = event.soyin;
            if(type=='4'){

           this.iStouchan =true

            }else{

              this.utilityService.putData( appConfig.testUrl +'/checkLists/'+id+'/status/'+type, {}, {Authorization: this.token})
                        .map(res => res.json())
                         .subscribe(
                         (val) => {
                          if(val.code == 200) {

                           this.nznot.create('success',val.msg,'');
                          if(type == 3){
                             this.mergeListData.splice(soyin,1)// 删除数组
                           }
                                //

                          }
                         },(error)=>{
                              if(error){
                                    this.nznot.create('error', error.json().msg,'');
                              }
                         });
                          }
            }


loading1 = false
loading2 = false
    mergeClick(index){
            let status = '';
                switch(index){
                    case 0 :
                    this.mergeisVisible = false
                    return;

                   case 1 :
                      this.loading1 = true;
                    status  = 'F'
                    break;
                        case 2 :
                     this.loading2 = true;
                    status = 'S'
                    break;
             }

                let self = this;
                this.modal.confirm({
                title  : '您是否确认要进行这项操作!',
                showConfirmLoading: true,
                onOk() {
                    self.utilityService.putData( appConfig.testUrl +'/checks/'+self.checkId+'/status/'+status, {}, {Authorization: self.token})
                                    .map(res => res.json())
                                    .subscribe(
                                (val) => {
                                         self.loading1 = false;
                                       self.loading2 = false;
                                    if(val.code == 200) {
                                    self.nznot.create('success',val.msg,'');
                                    //  self.detailVisible =false;
                                     self.mergeisVisible =false;
                                    }else{
                                            self.nznot.create('error', val.msg,'');
                                    }
                                },(error)=>{
                                    self.loading1 = false;
                                    self.loading2 = false;
                                        if(error){
                                                self.nznot.create('error', error.json().msg,'');
                                        }
                                    })
                },
                onCancel() {
                }
            });



        }

    buttonEvent(event) {
        this.mergeId = event.guid;

        if (event.names.key === 'merge') {

            this.idcheck = event.guid;
              let index = '';
              let indexs = '';
             this.detailVisible = true;
             this.utilityService.getData( appConfig.testUrl +'/checks/'+event.guid, {}, {Authorization: this.token})
                        // .map(res => res.json())
                         .subscribe(
                         (val) => {
                          this.detailVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          this.mergeData  = val.result.mergeLists;
                        for  (let i = 0; i < this.mergeData.length; i ++) {
                            if (this.mergeData[i].fullPath) {
                                indexs = this.mergeData[i].fullPath.indexOf(this.mergeData[i].partOfProject);
                                this.mergeData[i].fullPath = this.mergeData[i].fullPath.substring(indexs, this.mergeData[i].fullPath.length);
                            }
                        }
                         for  (let i = 0; i < this.checkModalData.length; i ++) {
                                      this.guidprent[i]['guid']=this.checkModalData[i].delivery.guid;
                                      this.guidprent[i]['guidWorkitem']=this.checkModalData[i].delivery.guidWorkitem.target
                            for (let j = 0; j < this.checkModalData[i].detailList.length; j ++) {
                                for (let x = 0; x < this.checkModalData[i].detailList[j].deliveryPatchDetails.length; x ++) {
                                    for (let  y = 0; y < this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList.length; y ++) {
                                           this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y]['buttons'] = null
                                        if (this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath) {
                                            index = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.indexOf(this.checkModalData[i].detailList[j].projectName);
                                            this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath = this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.substring(index, this.checkModalData[i].detailList[j].deliveryPatchDetails[x].fileList[y].fullPath.length);


                              }
                                    }
                                }
                            }
                        }
                                }
                                ,(error)=>{
                                  if(error){
                                    this.nznot.create('error', error.json().msg,'');
                                      }
                                })


        } else if (event.names.key  === 'details') {

        } else if (event.names === '成功') {
            alert('成功的方法');
        }



    }

   returnsclick(event) {
       let item = event.index
       this.mergeguid=event.it.guid
         let S = '';
        let  url = appConfig.testUrl + '/checks/delivery/' + this.mergeguid + '/result';
        if (item === 1) {
            S = 'S';
        }else {
            S = 'F';
        }
        const obj = {
                result : S,
                desc : this.inputValue
        };


       this.utilityService.putData( url, obj, {Authorization: this.token})
           .map(res => res.json())
           .subscribe(
               (val) => {
                   if (val.code == 200){

                        if(item === 1 ){
                           event.it.disabledS = true
                           event.it.deliveryResult = '核对成功'
                       }else  if(item === 2 ){
                          this.istextVisible = false;
                           event.it.disabledS = true
                           event.it.deliveryResult = '核对失败'
                       }
                       this.nznot.create('success', val.msg, val.msg);
                   }else{
                         this.nznot.create('error', val.msg,'');
                  }

               }
               ,
               (error) => {

                  if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
               }
           );
    //    }


    }

       checkSavemerge(event) {
        this.iStouchan = false;
         let objs =event.arr

        this.iStouchan = false;
        const obj ={
            guidDelivery:String(objs.guidDelivery),
            patchType:objs.patchType,
            deployWhere:objs.deployWhere
        }
          this.utilityService.putData( appConfig.testUrl +'/checkLists/'+event.errorId+'/delivery', obj, {Authorization: this.token})
                        .map(res => res.json())
                         .subscribe(
                         (val) => {
                          if(val.code == 200) {
                    this.mergeListData.forEach((result,i)=>{
                                 if(result.guid == event.errorId){
                                     this.mergeListData[i].checkbuttons = true;
                                       this.mergeListData[i].confirmStatus = '加入投放';
                                 }
                             })
                           this.nznot.create('success',val.msg,'');
                                //

                          }
                         },(error)=>{
                              if(error){
                                    this.nznot.create('error', error.json().msg,'');
                              }
                         });
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



    // 合并的确定
    determine() {
        this.mergeVisible = false;
    }
    moreclick() {
    }


    importCurrent = 0;
    // 导出接口
    // 查询导出环境和窗口
    isClick() {

    }
    // 上一步
    importpre() {
        this.importCurrent -= 1;
        this.changeContent();
    }
    // 下一步
    isExport =  true;
    appendSelect: any;
    nextImport() {
        // 下一步验证
        let profiles = '';
        let packTiming = '';
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                profiles = this.elementScice[i].guid;
                packTiming = this.elementScice[i].times;
            }
        }
        let exportObj = {
            deliveryTime: moment(this.deliveryTime).format('YYYY-MM-DD'),
            packTiming: packTiming,
            guidProfile: profiles
        };

        let url = '';
        if (profiles !== '' && packTiming !== '') {
            url = appConfig.testUrl + appConfig.API.export;
        }else {
            this.nznot.create('error', '请选择运行环境！', '请选择运行环境！');
            return;
        }

        if (this.importCurrent === 0) {
            // 测试接口,先测试
            this.utilityService.postData( url, exportObj,  {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        this.appendSelect = val.result;
                        this.importCurrent += 1;
                        this.changeContent();
                    },
                    (error) => {
                        this.importCurrent = 0;
                        this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                    }
                );
        }

    }




    // 保存
    importSave() {
        let workGuid = ''
        _.forEach(this.appendSelect , function (select) {
            if (select.check) {
                workGuid = select.guid;
            }
        })

        if(workGuid !== '') {
            let success = true;
            let token = this.token;
            let url = appConfig.testUrl + appConfig.API.excel + '/' + workGuid + '/excel';
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
            xhr.responseType = 'blob';  // 返回类型blob
            xhr.setRequestHeader('Authorization',token); // 可以定义请求头带给后端
            // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            xhr.onload = function () {

                // 请求完成
                if (this.status === 200) {
                    success = true;
                    // 返回200
                    let blob = this.response;
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
                    reader.onload = function (e) {
                        let target: any = e.target;
                        // 转换完成，创建一个a标签用于下载
                        let a = document.createElement('a');
                        a.download = '清单.xls';
                        // a.href = e.target.result;  会报错，是因为类型检查机制，没有这个result，所以用target任意属性来接受一下，就可以跳过类型检查机制了
                        a.href = target.result;
                        $('body').append(a);  // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                    };
                } else {
                    success = false;
                }
            };
            // 发送ajax请求
            xhr.send();

            if (success) {
                this.nznot.create('success', '请稍后！', '正在下载！');
            } else {
                this.nznot.create('error', '下载错误！', '请稍后！');
            }
            this.isVisible = false;
        } else {
            this.nznot.create('error',  '请选择工作项', '' ) ;
        }


    }

    // 拷贝投放
    copySave() {
        this.profiles = [];
        for (let i = 0; i < this.elementCopy.length; i ++) {

            if (this.elementCopy[i].check && this.elementCopy[i].times) {
                let obj = {
                    guidProfiles: this.elementCopy[i].guidProfile,
                    profilesName: this.elementCopy[i].profilesName,
                    packTiming: this.elementCopy[i].times,
                    applyAlias: this.elementCopy[i].deliveryName,
                    deliveryTime: moment(this.elementCopy[i].deliveryTime).format('YYYY-MM-DD')
                };
                this.profiles.push(obj);
            }
        }
        let splicingObj = {
            guidDelivery : this.copyseniorGuid, // 清单的guid
            profiles: this.profiles,
        };

        this.utilityService.postData(appConfig.testUrl  + appConfig.API.newProfiles, splicingObj, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    this.nznot.create('success', val.code , val.msg);
                    this.copyVisible = false;
                    this.launchVisible = true;
                    this.copyTitle = '投放新环境成功';
                    this.detailInfo = val.result; // 返回的数据有问题
                },
                (error) => {
                    this.nznot.create('error', JSON.parse(error._body).code , JSON.parse(error._body).msg);
                    // this.getData();
                 }
            );

    }

    // 比较copy的时间
    oncopyChange(time, array) {
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

    copyCancel() {
        this.getData(); // 重新查询
        this.launchVisible = false;
    }


}
