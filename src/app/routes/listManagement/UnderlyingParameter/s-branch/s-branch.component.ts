import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';
import {ProductModule} from '../../../../service/delivent/projectModule';
import {SbranchModule} from '../../../../service/delivent/sbranchModule';


@Component({
    selector: 'app-s-branch',
    templateUrl: './s-branch.component.html'
})
export class SBranchComponent implements OnInit {
    constructor(private http: _HttpClient,
                private router: Router,
                private utilityService: UtilityService,
                private modal: NzModalService,
                private nznot: NzNotificationService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
                private confirmServ: NzModalService
                ) {
    }
    branch: SbranchModule = new  SbranchModule();
    
    token: any;
    showAdd = false;
    isShowTotal = true;
    isPagination = true;
   ptitle:any
    // showTa
    ngOnInit() {
        this.token = this.tokenService.get().token;
        this.getData();
        this.showAdd = false;
        this.ptitle = '信息提示'
        
    }

    data: any[] = []; // 表格数据
    headerDate = [  // 配置表头内容
        {value: '分支类型', key: 'branchType', isclick: true},
        {value: '代码全路径', key: 'fullPath', isclick: false},
        {value: '创建人', key: 'creater', isclick: false},
        {value: '创建时间', key: 'createTime', isclick: false},
        {value: '分支作用说明', key: 'branchFor', isclick: false},
        {value: '分支当前版本', key: 'currVersion', isclick: false},
        {value: '分支起始版本', key: 'lastVersion', isclick: false},
    ];
    total: number;
    pageTotal: number;
    detailsVisible = false
    details: any[] = [];
    mergeVisible = false;
      buttons = [
        {key: 'add', value: '新增', if: true},
    ]
    buttonData = [
        // {key: 'details', value: '详情'},
        {key: 'dels', value: '删除'},
        {key: 'upd', value: '修改'}
    ];
    branchType = [
        {key: '特性', value: 'F',selector:false},
        {key: 'hot', value: 'H' ,selector:false},
        {key: 'release', value: 'R' ,selector:false},
    ]
    getData() {
            const page = {
                page: {
                    size: 10,
                    current: this.branch.page
                }
            };
            
            this.utilityService.postData(appConfig.testUrl + appConfig.API.sBranch, page, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                         
                      
                        if (val.code == 200) {
                            console.log(val);
                            this.data = val.result.records;
                            this.total = val.result.total; // 总数
                            this.pageTotal = val.result.pages * 10; // 页码
                            for (let i = 0 ; i <  this.data.length; i ++) {
                                this.data[i].buttonData = this.buttonData;
                               this.data[i].createTime = moment(this.data[i].createTime).format('YYYY-MM-DD');
                                  this.branchType.forEach( function (i) {
                        
                    
                                })
                          }
                        
                        }else{
                         this.nznot.create('error',val.msg,'');
                        }

                    },
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
                );
    }

    monitorHandler(event) {
        this.branch.page = event;
          this.getData();
    }

    // 接受子组件删除的数据 单条还是多条
    deleatData(event) {

    }
  
    // 顶部按钮
  
    addHandler(event) {
        console.log(this.branch)
        
        if (event === 'add') {
             this.branch = new  SbranchModule();
             console.log()
              this.detailsVisible = true;
              this.ptitle = '新增分支'
        }
    }
    // 按钮点击事件
    buttonEvent(event) {

        let obj = event.guid;

        if (event.names.key === 'dels') { // 按钮传入删除方法
              let self = this; 
    this.confirmServ.confirm({
      title  : '您是否确认要删除这项内容!',
      showConfirmLoading: true,
      onOk() {
            self.utilityService.deleatData(appConfig.testUrl  + appConfig.API.sBranchadd +'/'+ obj, {Authorization: self.token})
                  .map(res => res.json())
                .subscribe(
                    (val) => {
                        let arr = [];
                      if(val.code == 200) {
                          
                          self.getData();
                
                  self.nznot.create('success', val.msg, val.msg);
                        }else {
                            self.nznot.create('error', val.msg, val.msg);
                        }
            }   ,
                (error) => {
                    self.nznot.create('error', error.msg,error.msg);
                }
                   
                );
      },
      onCancel() {
      }
    });
  


           
        } else if (event.names.key === 'upd') {
           
           
                 this.branchType.forEach( function (i) {
                            console.log(i)
                            if(event.branchType == i.key) {
                                event.branchType = i.value;
                            }
                 })
                  this.branch = event;
            this.ptitle = '修改分支'
            this.detailsVisible = true;
             console.log(this.branch);
              console.log(event);
        }  else if (event.names.key === 'details') {
          this.detailsVisible = true
            this.utilityService.getData(appConfig.testUrl  + appConfig.API.sBranchadd +'/'+ obj,{}, {Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {
                        console.log(val);
                        this.details = val.result;
                    },
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
                );
        } 

    }
       checkversion(item,index){
            console.log(item)
            
        }


    addsubmit(){
        
        
        let obj = this.branch;
        console.log(this.branch)
          if(!obj.branchFor||!obj.fullPath||!obj.branchFor||!obj.lastVersion){
             this.nznot.create('error', '请输入完整的信息！','');
             return;
          }
    
        if ( !obj.guid ) {
              this.utilityService.postData(appConfig.testUrl  + appConfig.API.sBranchadd ,obj, {Authorization: this.token})
      .map(res => res.json())
        .subscribe(
            (val) => {
                console.log(this.branch);
             
             if(val.code == 200) {
                  this.detailsVisible = false;
                 this.getData();

                  this.nznot.create('success', val.msg, val.msg);
             }else {
                this.nznot.create('error', '异常', '异常');
             }
            }   ,
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
                
        );
    }else {
             
                  console.log(this.branch);
        
             this.utilityService.putData(appConfig.testUrl  + appConfig.API.sBranchadd, obj,{Authorization: this.token})
      .map(res => res.json())
        .subscribe(
            (val) => {
              
             if(val.code == 200) {
              
                     
                  console.log(this.branch);
                  this.detailsVisible = false;
                  this.nznot.create('success', val.msg, val.msg);
             }else {
                this.nznot.create('error', '异常', '异常');
             }
            }   ,
                (error)=>{
                    if(error){
                          this.nznot.create('error', error.json().msg,'');
                    }
                }
                
        );
        }
     
    }



}
