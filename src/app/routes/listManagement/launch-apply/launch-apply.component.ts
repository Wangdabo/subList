import { Component, OnInit , Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { catchError, map, tap } from 'rxjs/operators';
import * as moment from 'moment';
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
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }
    token: any;
    userName: string;
    isNext = true;
    initDate:any;
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.userName = this.tokenService.get().name;
        this.getData(1);
        this.showAdd = true;
        console.log(this.isNext);

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
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期
    isShowTotal = true;
    pageTotal: number; // 翻页总数
    deliveryResult = [
        {key: '0', value: '申请中'},
        {key: 'S', value: '成功'},
        {key: 'F', value: '失败'},
        {key: 'C', value: '取消投放'},
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
        { value: '申请类型', key: 'deliveryType', isclick: false, radio: false },
        { value: '程序数量', key: 'number', isclick: false, radio: false },

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

    // buttonData = [
    //     // {key: 'details', value: '详情'},
    //     {check: false, value: '未确认合并'},
     
    // ];

    test: string;
    page: any;
    total: number;
    pages: number;
    elementScice: any; // 环境数据
    branches: any[] = []; // 合并清单分支数组
    patchCount: any[] = []; // 投放小计
    detailList: any[] = []; // 合并清单代码数组
    profilesData: any;
    checkModalData: any[] = []; // 核查清单数据
    mergeListData: any[] = []; // 核查有异议的数据
    isShowDate = false;

    inputValue = '';

        getData(index) {

            const page = {
                page : {
                    size: 10,
                    current : index
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
                            }
                        }


                    },
                    (error) => {
                        console.log(error);
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

            this.utilityService.getData(appConfig.testUrl  + appConfig.API.sProfiles, {}, {Authorization: this.token})
                .subscribe(
                    (val) => {
                        this.mergeisVisible = true;
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
                    }
                );


        } else if (event === 'checking') {
              this.getSprofiles();
             this.mergeisVisible = true
            // this.changeContent();
            // this.checkModalVisible = true; // 打开核对弹出框

        } else if (event === 'export') {
            this.isVisible = true;
            this.workItem = false;
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
    buttonClick(e) {
            console.log(e);
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
                         
                        }
                    );
    }


    current = 0;

    
    index = 'First-content';
    
    pre(): void {
          this.current -= 1;
          this.changeContent();
    }
    
    next(): void {
           console.log(this.elementScice)
     
        if(this.current == 0) {
        let url = '';
        let profiles = '';
        let packTiming = '';
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].check && this.elementScice[i].times) {
                profiles = this.elementScice[i].guid;
                packTiming = this.elementScice[i].times;

            }
        }
        if (profiles !== '' && packTiming !== '') {
            url = appConfig.testUrl + '/checks/profiles/' + profiles + '/packTiming/' + packTiming;   
          }else {
            this.nznot.create('error', '请选择运行环境！', '请选择运行环境！');
            return;
        }
         let index = '';
        let indexs = '';
        //   this.current += 1;
          let arr = [];
        // 跳转核对列表
        this.utilityService.getData( url, {}, {Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code === '200') {
                     
                        
                        val.result.forEach(function(item,i){
                            arr[i]=item.delivery
                            arr[i]['branch']=item.branch
                            arr[i]['projectList'] = item.projectList;
                            arr[i]['expand'] =false;
                            arr[i]['check'] = true;
                            arr[i]['buttonData']= [ {check: false, value: '未确认合并'}];
                             arr[i]['guidWorkitem'] = item.delivery.guidWorkitem.target;
            
                        })
                        this.initDate = arr;
                        console.log(arr)
                         this.current += 1;
                                }else{
                                    this.nznot.create('error',val.msg,val.msg);
                                }
                                
                            }
                            ,
                            
                            (error) => {
                                let msg = error.json();
                                this.nznot.create('error',msg.msg,'');
                            })
                            // step2
                   }else{
                    
                    let flage = true;
                    for (let i = 0; i < this.initDate.length; i++) {
                        if(this.initDate[i].buttonData[0].check == false) {
                            flage = false;
                            this.nznot.create('error','请确认去合并！！','');
                             return;
                        }
                    }
                    
                    if( flage == true ) {
                            this.current += 1;
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
    buttonEvent(event) {
          
        let url ='/deliveries/'+event+'/merge'
            this.utilityService.putData(appConfig.testUrl  + url,{}, { Authorization: this.token})
            .map(res => res.json())
            .subscribe(
                (val) => {
                    console.log(val)
                    if (val.code == 200) {
                       
                     }else {
                         this.nznot.create('error', val.msg, val.msg);
                     }

                },
                (error) =>{
                    this.nznot.create('error', error.msg,'');
                })

    }

    // 列表按钮方法
    buttonDataHandler(event) {

        console.log(event);

    }



    // 处理行为代码，跳转、弹出框、其他交互
    isActive(event) {
       if(event) {
            this.isNext = false;
       }
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
                    this.nznot.create('error', error.msg, error.msg);
                }
            );
        this.checkModalVisible = false; // 打开核对弹出框
    //
    }

    onChange(item) {
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].guid !== item && this.elementScice[i].check === true) {
                this.elementScice[i].check = false;
            }
        }

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
                        //  this.profilesData = obj;
                        //  this.detailList = val.result.detailList;
                        //  this.branches = val.result.branches;
                        //  this.patchCount = val.result.patchCount;
                        // //  this.mergeisVisible = false;
                        // //  this.mergeVisible = true;

                        // for  (let i = 0; i < this.detailList.length; i ++) {
                        //     for (let j = 0; j < this.detailList[i].deliveryPatchDetails.length; j ++) {
                        //         for (let x = 0; x < this.detailList[i].deliveryPatchDetails[j].fileList.length; x ++) {
                        //                    if (this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath) {
                        //                        index = this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.indexOf(this.detailList[i].projectName);
                        //                        this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath = this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.substring(index, this.detailList[i].deliveryPatchDetails[j].fileList[x].fullPath.length - 1);
                        //                    }
                        //         }
                        //     }
                        // }
                     }else {
                         this.nznot.create('error', val.msg, val.msg);
                     }

                },

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
                   }

               }
               ,
               (error) => {
                   console.log(error);
                   this.nznot.create('error', '异常', '异常');
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
            );
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
    moreclick() {
        console.log('sssss');
    }


}
