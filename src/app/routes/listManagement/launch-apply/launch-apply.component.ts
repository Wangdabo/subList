import { Component, OnInit , Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ResponseContentType } from '@angular/http';


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

    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.userName = this.tokenService.get().name;
        this.getElement();
        this.getData();
        this.showAdd = true;
     
    

    }

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
    deliveryResult = [
        {key: '0', value: '申请中'},
        {key: 'M', value: '已合并'},
        {key: 'C', value: '核对中'},
        {key: 'S', value: '核对成功'},
        {key: 'F', value: '核对失败'},
        {key: 'D', value: '投放成功'},
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

    headerDate = [  // 配置表头内容
        { value: '别名', key: 'applyAlias', isclick: false, radio: false},
        { value: '工作项', key: 'guidWorkitem', isclick: true, radio: false },
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '运行环境', key: 'guidProfiles', isclick: false, radio: false },
        { value: '打包窗口', key: 'packTiming', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        { value: '投放类型', key: 'deliveryType', isclick: false, radio: false },
        // { value: '程序数量', key: 'number', isclick: false, radio: false },

    ];

     mergeHeader = [  // 配置表头内容

        { value: '工作项', key: 'guidWorkitem', isclick: true, radio: false },
        { value: '分支', key: 'branch', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放申请(别名)', key: 'applyAlias', isclick: false, radio: false },
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        { value: '申请类型', key: 'deliveryType', isclick: false, radio: false },
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
     currentpage = 1;
    inputValue = '';
   search = {
        guidWorkitem:'',
        proposer:'',
        deliveryResult:'',
        guidProfiles:''
    };
        getData() {
       
            const page = {
                condition:this.search,
                page : {
                    size: 10,
                    current :  this.currentpage
                }
            };
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.list, page, { Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {

                        if (val.code == 200) {
                            this.data = val.result.records;
                            console.log(this.data);
                            this.total = val.result.total; // 总数
                            this.pageTotal = val.result.pages * 10; // 页码
                            for ( let i = 0; i < this.data.length; i++) {
                                this.data[i].deliveryTime = moment(this.data[i].deliveryTime).format('YYYY-MM-DD');
                                this.data[i].guidProfiles = this.data[i].guidProfiles.target;
                                this.data[i].guidWorkitem = this.data[i].guidWorkitem.target;
                                this.data[i].buttonData = [{
                                    key:'dels',value:'删除'
                                }]
                            }
                        }


                    },
                    (error) => {
                        console.log(error);
                    }
                );

    }

getElement() {
      this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiles, {}, {Authorization: this.token})
                .subscribe(
                    (val) => {
                       
                        this.elementScice = val.result;
  console.log(this.elementScice)
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
              this.getSprofiles();
             this.mergeisVisible = true
        //    this.current = 0;
            // this.changeContent();
            // this.checkModalVisible = true; // 打开核对弹出框

        } else if (event === 'export') {
            this.deliveryTime = moment(new Date()).format('YYYY-MM-DD');
            console.log(this.deliveryTime)
            this.isVisible = true;
            this.getSprofiles(); // 查询环境和时间
            this.workItem = false;
        } else {
            console.log(event)
            console.log('详情界面');
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


    current = 0;

    loading:any;
    index = 'First-content';

    pre(): void {
          this.current -= 1;
          this.changeContent();
    }

    next(): void {
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
                    console.log(val)
                    if (val.code === '200') {

                       this.current += 1;
                       console.log(this.current)
                          for(let i = 0;i<val.result.length;i++){
                               arr[i]=val.result[i].delivery
                            arr[i]['branch']=val.result[i].branch
                            arr[i]['projectList'] = val.result[i].projectList;
                            arr[i]['expand'] =false;
                            arr[i]['check'] = true;
                             if(val.result[i].delivery.deliveryResult === "申请中"){
                                  arr[i]['buttonData']= [ {check: false, value: '未确认合并'}];
                            }else{
                                   arr[i]['buttonData']= [ {check: true, value: '已确认合并'}];
                            }
                            arr[i]['guidWorkitem'] = val.result[i].delivery.guidWorkitem.target;
                          }

                        this.initDate = arr;
                        // console.log(arr)

                                }else{
                                    this.nznot.create('error',val.msg,val.msg);
                                }
                            },
                            (error) => {
                                // console.log(error)
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
                            console.log(this.current)
                           let index = '';
                             let indexs = '';
                             console.log(url);
            this.utilityService.postData(url, {}, {Authorization: this.token})
                        .map(res => res.json())
                         .subscribe(
                         (val) => {
                             console.log(val)
                               this.checkloading = false;
                            this.current += 1;
                         this.checkListVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          this.mergeListData  = val.result.mergeLists;
                        for  (let i = 0; i < this.mergeListData.length; i ++) {
                            this.mergeListData[i]['check'] = null;
                            if (this.mergeListData[i].fullPath) {

                                indexs = this.mergeListData[i].fullPath.indexOf(this.mergeListData[i].partOfProject);
                                this.mergeListData[i].fullPath = this.mergeListData[i].fullPath.substring(indexs, this.mergeListData[i].fullPath.length);
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
                    }


                   }



    }

    done(): void {
        console.log('done');
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

    // 按钮点击事件
    buttonEventlist(event) {
        console.log(event)
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
                                    //
                                   
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
          
        }

        

    }

    // 列表按钮方法
    buttonDataHandler(event) {

        console.log(event);

    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
       if (event) {
            this.isNext = false;
       }
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
    // 核查确定
    saveCheck(url) {
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
                        console.log(val)

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
                   console.log(val);

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
                   console.log(error);
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
                    console.log(val)
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
            console.log(type);
            console.log(id);
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



    mergeClick(index){
            let status = '';
                switch(index){
                    case 0 :
                    this.detailVisible = false
                    return;

                        case 1 :
                    status  = 'F'
                    break;
                        case 2 :
                    status = 'S'
                    break;
             }

                let self = this;
                this.modal.confirm({
                title  : '您是否确认要进行这项操作!',

                showConfirmLoading: true,
                onOk() {
                    self.utilityService.putData( appConfig.testUrl +'/checks/'+self.idcheck+'/status/'+status, {}, {Authorization: self.token})
                                    .map(res => res.json())
                                    .subscribe(
                                (val) => {
                                    if(val.code == 200) {

                                    self.nznot.create('success',val.msg,'');
                                        self.detailVisible =false;
                                    }else{
                                            self.nznot.create('error', val.msg,'');
                                    }
                                    },(error)=>{
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
       console.log(event)
        if (event.names.key === 'merge') {
            this.idcheck = event.guid;
              let index = '';
              let indexs = '';
             this.detailVisible = true;
             this.utilityService.getData( appConfig.testUrl +'/checks/'+event.guid, {}, {Authorization: this.token})
                        // .map(res => res.json())
                         .subscribe(
                         (val) => {
                           console.log(val);

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
                        console.log(this.guidprent)
                                }
                                ,(error)=>{
                                    console.log(error)
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
       this.mergeguid=event.id

    let S = '';
    console.log(this.guidprent)
    if ( item === 0) {

        this.istextVisible = true;
    }else {
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
                   console.log(val);

                   if (val.code == 200){
                       this.istextVisible = false;
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


    }

       checkSavemerge(event) {
        this.iStouchan = false;
        const obj ={
            guidDelivery:event.guidDelivery,
            patchType:event.patchType,
            deployWhere:event.deployWhere
        }
          console.log(event)
          this.utilityService.putData( appConfig.testUrl +'/checkLists/'+this.mergeId+'/delivery', obj, {Authorization: this.token})
                        .map(res => res.json())
                         .subscribe(
                         (val) => {
                          if(val.code == 200) {

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
        console.log('确定成功');
        this.mergeVisible = false;
    }
    moreclick() {
        console.log('sssss');
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

        if (this.current === 0) {
            // 测试接口,先测试
            console.log(url)
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



/*    downloadFile(): Observable<Blob> {

        let applicationsUrl = appConfig.testUrl + appConfig.API.excel + '/124/excel';
        console.log(applicationsUrl);
        let headers = new Headers({Authorization: this.token});
        console.log(headers);
        let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Blob });

      /!*  return this.http.get(applicationsUrl, options)
            .map(res => res.blob())
            .subscribe(
                (val) => {
                    console.log(val)
                })
            .catch(this.handleError);*!/
      return   this.utilityService.getData(applicationsUrl , {}, {Authorization: this.token})
                .map(res => res.blob())
                .subscribe(
                      (val) => {

                      })
                .catch(this.handleError);

    }*/

/*    this.myService.downloadFile(this.id).subscribe(blob => {
    importedSaveAs(blob, this.fileName);
}
)*/



    // 保存
    importSave() {
        /*let headers = new Headers();
        headers.append('Authorization', this.token);
        return this.utilityService.getData(appConfig.testUrl + appConfig.API.excel + '/124/excel' , {}, headers)
            .map(res => new Blob([res._body], { type: 'application/vnd.ms-excel' })
            .subscribe(
                    (val) => {
                        console.log(val)
                    }
             )*/


        /* downloadFile().subscribe(blob => {
             importedSaveAs(blob, '123.xls');
         });
       */

        let workGuid = ''
        _.forEach(this.appendSelect , function (select) {
            if (select.check) {
                workGuid = select.guid;
            }
        })

        this.utilityService.getData( appConfig.testUrl + appConfig.API.excel + '/' + workGuid + '/excel', { responseType: 'blob' }, {Authorization: this.token})
            .subscribe(
                (val) => {
                   console.log(val);
                });



        this.isVisible = false;
    }




}
