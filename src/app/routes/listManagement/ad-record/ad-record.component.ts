import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { MergelistComponent } from '../../../component/mergelist/mergelist.component';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-ad-record',
    templateUrl: './ad-record.component.html',
})
export class AdRecordComponent implements OnInit {
    // @ViewChild(MergelistComponent) child: MergelistComponent;

    constructor(
        private http: _HttpClient,
        private router: Router,
        private utilityService: UtilityService,
        private modal: NzModalService,
        private nznot: NzNotificationService,
       @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,

        // private MergelistComponent : MergelistComponent
    ) { }


   token: any;
    list: any[] = [];
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData();
        this.showAdd = true;

    }
    mergeId :any;
    showAdd: boolean; // 是否有修改
    configTitle = '详情';
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期
    pageTotal: number;
    isShow = false;
    pageIndex = 1
    dliveryResult = [
        {key: '0', value: '否'},
        {key: '1', value: '是'}
    ]
     deliveryResults = [
        {key: '0', value: '申请中'},
        {key: 'M', value: '已合并'},
        {key: 'C', value: '核对中'},
        {key: 'S', value: '核对成功'},
        {key: 'F', value: '核对失败'},
        {key: 'D', value: '投放成功'},
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
        // buttons: [
        //     { key: 'Overview', value: '查看概况' }
        // ]
    }
    buttonData = [
        {key: 'merge', value: '核对',if:false },
        // {key: 'dels', value: '删除',if:false },
        //  {key: 'details', value: '详情',if:false }
    ]

isShowTotalhead = false;
    test: string;
    page: any;
    total: number;
    loading = false
    index = 1;

    getData() {
   
        const page = {
            page : {
                size: 10,
                current : this.index,
                 orderByField: 'guid',
                    asc: false
            }
        };
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.checklist, page, { Authorization: this.token})
            .subscribe(
                (val) => {
                    this.data = val.result.records;

                    this.total = val.result.total; // 总数
                    this.pageTotal = val.result.pages * 10; // 页码
                      this.pageIndex = val.result.current;
                    for ( let i = 0; i < this.data.length; i++) {
                        this.data[i].checkDate = moment(this.data[i].checkDate).format('YYYY-MM-DD');
                       this.data[i].guidProfiles =  this.data[i].guidProfiles.target;
                       this.data[i].buttonData = this.buttonData;
                    }

                },(error)=>{
                        this.nznot.create('error', error.msg,'');
                }
            );
    }

    detailVisible =false;

    // 列表组件传过来的内容
    addHandler(event) {

        if (event === 'merge') {



            // this.mergeVisible = true;
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
        this.index =event
     this.getData();
    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }
  mergeListInfo: any[] = [];
      mergeListData: any[] = []; // 核查有异议的数据
         checkModalData: any[] = []; // 核查清单数据
         guidprent=[
            // { guid:'',
            //  guidWorkitem:''
            //    }

         ]



    // 按钮点击事件
    idcheck:any
    checkloading:any;
    checkStatus:boolean;
    title:any;
    buttonEvent(event) {
        this.mergeId = event.guid;

        if (event.names.key === 'merge') {

            this.idcheck = event.guid;
              let index = '';
              let indexs = '';
             this.detailVisible = true;
              this.checkloading = true;
             this.utilityService.getData( appConfig.testUrl +'/checks/'+event.guid, {}, {Authorization: this.token})
                         .subscribe(
                         (val) => {

                            this.checkloading = false;
                          this.detailVisible = true;
                          this.checkModalData = val.result.deliveryDetails;
                          console.log(val)
                          if(val.result.check.checkStatus == '正在核对'){
                                this.checkStatus = true

                          }else{
                               this.title = val.result.check.checkStatus
                                this.checkStatus = false
                          }


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
                                                  if(this.mergeListData[i].fullPath.length > 30){
                                                        star = this.mergeListData[i].fullPath.substr(0,10)
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
                                    //  let checkingloading = {checkingloading:false}
                                      this.guidprent.push(obj);
                                    //    this.checkModalData[i].delivery.push(checkingloading);
                                       this.checkModalData[i].delivery.checkingloading = false;
                                     if(  this.checkModalData[i].delivery.deliveryResult =='核对中' ){
                                          this.checkModalData[i].delivery.disabledS = false;
                                     }else{
                                         this.checkModalData[i].delivery.disabledS = true;
                                     }



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
                        console.log(this.checkModalData);
                        //

                                }
                                ,(error)=>{
                                    console.log(error)
                                    this.nznot.create('error', error.msg,'');
                                })


        } else if (event.names.key  === 'details') {
            //  this.modal.open({
            //     title          : '对话框标题',
            //     content        : MergelistComponent,
            //     onOk() {
            //     },
            //     onCancel() {
            //         console.log('Click cancel');
            //     },
            //     footer         : false,
            //     componentParams: {
            //         name: '测试渲染Component'
            //     }
            // });
        } else if (event.names === '成功') {
            alert('成功的方法');
        }



    }
loading1 = false
loading2 = false
mergeClick(index){
    let status = '';

   switch(index){
       case 0 :
       this.detailVisible = false
       return;

         case 1 :
         this.loading1 = true;
       status  = 'F'
       break;
         case 2 :
       status = 'S'
       this.loading2 = true;
       break;
   }

    let self = this;
    this.modal.confirm({
      title  : '您是否确认要进行这项操作!',
      showConfirmLoading: true,
      onOk() {
           self.utilityService.putData( appConfig.testUrl + '/checks/' + self.mergeId + '/status/' + status, {}, {Authorization: self.token})
                        // .map(res => res.json())
                         .subscribe(
                       (val) => {
                           console.log(self.mergeId);
                           self.getData()
                           self.loading1 = false;
                           self.loading2 = false;
                          if (val.code === '200') {

                           self.nznot.create('success', val.msg,  '');
                             self.detailVisible = false;
                          }else{
                                self.nznot.create('error', val.msg, '');
                          }
                         }, (error) => {
                           self.loading1 = false;
                           self.loading2 = false;
                              if (error) {
                                    self.nznot.create('error', error.msg, '');
                              }
                         })
      },
      onCancel() {
      }
    });


}

    // 列表按钮方法
    buttonDataHandler(event) {




    }
     iStouchanRecord = false
     
        buttonClick(event){
            let type = event.index;
            let id = event.id;
            let soyin = event.soyin;
            if (type === 4) {
           this.iStouchanRecord = true
            }else {
              this.utilityService.putData( appConfig.testUrl + '/checkLists/' + id + '/status/' + type, {}, {Authorization: this.token})
                         .subscribe(
                         (val) => {
                          if (val.code === '200') {

                           this.nznot.create('success', val.msg, '');
                           this.iStouchanRecord = false;
                           if (type === 3){
                             this.mergeListData.splice(soyin, 1) // 删除数组
                           }
                          }
                         }, (error) => {

                          this.nznot.create('error', error.msg, '');

                         });
                          }
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

      guidDelivery:string;
      patchType:any;
      deployWhere:any;
    // 关闭核对清单
    checkSave(event) {
        let objs = event.arr

        const obj ={
            guidDelivery:String(objs.guidDelivery),
            patchType:objs.patchType,
            deployWhere:objs.deployWhere
        }

          this.utilityService.putData( appConfig.testUrl + '/checkLists/' + event.errorId + '/delivery', obj, {Authorization: this.token})
                         .subscribe(
                         (val) => {
                             
                    
                          if (val.code === '200') {
                                 this.iStouchanRecord = false;
                             this.mergeListData.forEach((result,i) => {
                                 if(result.guid === event.errorId){
                                     this.mergeListData[i].checkbuttons = true;
                                       this.mergeListData[i].confirmStatus = '加入投放';
                                 }
                             })
                           this.nznot.create('success', val.msg, '');

                   
                          }
                         }, (error) => {
                                 this.nznot.create('error', error.msg, '');
                         });
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

    istextVisible = false;
    inputValue:any;
    guid:any;
   returnsclick(event) {
       let item = event.index
       this.guid = event.it.guid
       let S = '';


       let  url = appConfig.testUrl + '/checks/delivery/' + this.guid + '/result';
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
           .subscribe(
               (val) => {

                   if (val.code === '200') {
                         console.log(this.istextVisible )

                       this.istextVisible = false;

                       if (item === 1 ) {
                           event.it.disabledS = true
                           event.it.deliveryResult = '核对成功'
                       }else  if (item === 2 ){
                           event.it.disabledS = true
                           event.it.deliveryResult = '核对失败'
                       }

                       this.nznot.create('success', val.msg, val.msg);
                   }else{
                         this.nznot.create('error', val.msg, '');
                  }

               }
               ,
               (error) => {
                this.nznot.create('error', error.msg,'');
               }
           );



    }
    // 合并的确定
    determine() {
        console.log('确定成功');
        this.mergeVisible = false;
    }


}
