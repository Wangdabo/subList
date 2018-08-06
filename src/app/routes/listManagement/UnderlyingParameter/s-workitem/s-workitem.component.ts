import { Component, OnInit, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {UtilityService} from '../../../../service/utils.service';
import {appConfig} from '../../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { WorkitemModule } from '../../../../service/delivent/workItemModule';
import { BranchModule} from '../../../../service/delivent/brachModule';
import * as _ from 'lodash';
import * as moment from 'moment';
import {ProductModule} from '../../../../service/delivent/projectModule';

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


    // 变量
    isPagination = true; // 是否有分页
    showAdd: boolean; // 是否有修改
    workItem: WorkitemModule = new  WorkitemModule(); // 信息
    workAdd: WorkitemModule = new  WorkitemModule(); // 信息
    data: any[] = []; // 表格数据
    modalVisible = false; // 默认弹出框关闭
    assVisible = false; // 默认关闭
    modelTitle: string; // 默认名称
    headerDate = [  // 配置表头内容
        { value: '工作项名称', key: 'itemNamestr', isclick: false,title:true },
        // { value: '开发分支', key: 'itemNamestr', isclick: false },
        { value: '开发人员', key: 'developers', isclick: false },
        { value: '工作项负责人', key: 'owner', isclick: false },
        { value: '启动开发时间', key: 'developStartTime', isclick: false },
        { value: '计划投产时间', key: 'deliveryPlanTime', isclick: false },
        { value: '工作项状态', key: 'itemStatus', isclick: false },
    ];
    checkOptionsOne = [
        { label: '新建分支', value: 'branch', checked: true },
        { label: '新建工程', value: 'project', checked: false },
    ];
    projectInfo = false;
    prolist: any[] = []; //工程列表
    // 传入按钮层
    moreData = {
        morebutton: true,
        buttonData: [
        ]
    }
    pageIndex = 1
    expand = false;
    tabs = [
        {active: true, name  : '选择已有分支'},
        {active: false, name  : '新增分支'}];
    test: string;
    page: any;
    token: any; // token
    total: number;
    pageTotal: number;
    buttons = [
        {key: 'add', value: '新建工作项', if: true}

    ];
    assbranch: any; // 分支信息
    exitInfo: any;
    isEdit = false; // 默认是新增
    isShowTotal: boolean;
    subPro = []
    branchInfo = false; // 弹出框 默认为false
    branchData: BranchModule = new BranchModule();
    branchdataInfo: boolean; // 分支详情
    // 枚举值
    owner: any; // 人员
    branch: any; // 查询分支
    branchType = [
        {key: 'feature', value: 'F', selector:false},
        {key: 'hot', value: 'H' , selector:false},
    ]
     addBranch = {
        branchType: null,
        branchFor: null
    };
    active = true;
    list = [];
    // 初始化方法
    ngOnInit() {
        this.showAdd = true;
        this.isShowTotal = true;
        this.branchdataInfo = false; // 默认不显示详情
        this.token  = this.tokenService.get().token; // 绑定token
        this.getData();
        this.getOper()
        this.initDate(); // 默认时间
    }
    getData(option?) {
        if (option) {
            this.page = {
                condition: option, // 搜索内容
                page: {
                    current: 1, // 查询引起的，默认为1，否则会出问题,比如在第四页查询，这个匹配值没有四页，那就会为空
                    size: this.workItem.size,
                    orderByField: 'guid',
                    asc: false // asc 默认是true  升序排序，时间类型 用false， 降序
                }
            };
        } else {
            this.page = {
                condition: this.workItem, // 搜索内容
                page: {
                    current: this.workItem.pi,
                    size: this.workItem.size,
                    orderByField: 'guid',
                    asc: false // asc 默认是true  升序排序，时间类型 用false， 降序
                }
            };
        }

        this.utilityService.postData(appConfig.testUrl  + appConfig.API.workItemList , this.page, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.data = val.result.records;
                    this.total = val.result.total;
                    this.pageTotal = val.result.pages * 10;
                    this.pageIndex = val.result.current;
                    _.forEach(this.data , function (value) {
                                 value.itemNamestr = value.itemName
                                if(value.itemName.length > 20){
                                value.itemNamestr = appConfig.subString(value.itemName,10);
                                }



                        if (value.itemStatus === '开发中') {
                            if (value.fullPath !== '') { // 说明存在分支

                                value.buttonData = [
                                    {key: 'upd', value: '修改'},
                                    {key: 'cenel', value: '关闭'},
                                    {key: 'close', value: '取消分支'},
                                    {key: 'branchDDetail', value: '分支详情'},
                                    {key: 'project', value: '拉工程'},
                                    {key: 'putProductStatus', value: '已投产'}
                                ];
                            } else {
                                value.buttonData = [
                                    {key: 'upd', value: '修改'},
                                    {key: 'cenel', value: '关闭'},
                                    {key: 'association', value: '关联分支'},

                                ];
                            }
                        }
                        value.receiveTime = moment(value.receiveTime).format('YYYY-MM-DD');
                        value.developStartTime = moment(value.developStartTime).format('YYYY-MM-DD');
                        value.deliveryTime = moment(value.deliveryTime).format('YYYY-MM-DD');
                        value.deliveryPlanTime = moment(value.deliveryPlanTime).format('YYYY-MM-DD');
                    });


                },
                error => {
                    this.nznot.create('error', error.code , error.msg);
                }
            );
    }
    // 查询方法
    search() {
        this.getData(this.workItem);
    }
    // 重置方法
    reset() {
        this.workItem = new WorkitemModule();
        this.getData();
    }
    // 查询分支
    getBranch() {
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.notAllot , {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                 this.branch = val.result;

            });
    }
    // 查询人员
    getOper() {
        this.utilityService.postData(appConfig.testUrl  + appConfig.API.svncount , {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                    this.owner = val.result;
                });
    }

    // 初始化时间
    initDate() {
        this.workAdd.receiveTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.developStartTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.deliveryTime =  moment(new Date()).format('YYYY-MM-DD');
        this.workAdd.deliveryPlanTime =  moment(new Date()).format('YYYY-MM-DD');
    }
    // 新增方法
    addHandler(event) {
        if (event === 'add') {
            this.workAdd = new WorkitemModule(); // 清空
            this.isShowArtf = false;
            this.modalVisible = true;
            this.isEdit = false;
            this.modelTitle = '新建工作项';
        }
    }


    buttonDataHandler(event) {

    }

    // 翻页方法
    monitorHandler(event) {
        this.workItem.pi = event;
        this.page = {
            page: {
                current: event, // 页码
                size: this.workItem.size, //  每页个数
            }
        };
        this.getData();
    }

      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      }

      searchpro(ret: any) {
      }

      select(ret: any) {
      }

      change(ret: any) {
         for (let i = 0 ; i < ret.list.length; i++){
             ret.list[i]['status'] =  ret.to
         }
      }

    tabChange(obj){
        this.active = obj;
    }

    workId: string; //工作项ID
    // 按钮点击事件方法
    buttonEvent(event) {
        this.workId = event.guid;
        if (!_.isNull(event.names)) {
            if (event.names.key === 'upd') {
                this.modelTitle = '修改工程';
                this.modalVisible = true;
                this.workAdd = _.cloneDeep(event);
                this.isEdit = true;

            } else if(event.names.key === 'project') {
                   this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' +  event.guid + '/project',  {},  {Authorization: this.token})
                            .subscribe(
                                (val) => {
                               let others = [];
                               let own = []
                                   if (val.result.others.length > 0) {
                                        for (let j = 0; j < val.result.others.length; j++){
                                          val.result.others[j]['exit'] = 'left';
                                   }
                                }
                                  if (val.result.own.length > 0) {
                                       for(let j = 0; j < val.result.own.length; j++) {
                                              val.result.own[j]['exit'] = 'right';
                                       }
                                    }
                                    others = val.result.others;
                                    own = val.result.own;
                                    if (own.length > 0 && others.length > 0) {
                                           others = others.concat(own);
                                    }else if (others.length === 0 && own.length > 0 ) {
                                         others = own;
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
                                     this.projectInfo = true;
                                    // this.nznot.create('success',val.msg,val.msg);
                                    // this.getData();
                                },
                                (error) => {
                                    this.nznot.create('error', error.code , error.msg);
                                }
                            );

            } else if (event.names.key  === 'association') {

                this.assbranch = undefined;
                this.branchdataInfo = false;
                this.getBranch();
                this.addBranch.branchFor = null;
                this.addBranch.branchType = null;
                this.assVisible = true;
                this.exitInfo = event;
            } else if (event.names.key  === 'putProductStatus') {
                this.modal.open({
                    title: '已投产',
                    content: '您是否确定已投产?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.putData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' +  event.guid + '/putProductStatus',  {},  {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    console.log(val)
                                    this.nznot.create('success', val.msg, val.msg);
                                    this.getData();
                                },
                                (error) => {
                                    this.nznot.create('error', error.code , error.msg);
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });
            } else if (event.names.key  === 'close') {
                this.modal.open({
                    title: '取消关联',
                    content: '您是否确定取消关联分支?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' +  event.guid + '/cancel',  {},  {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    console.log(val)
                                    this.nznot.create('success', val.msg, val.msg);
                                    this.getData();
                                },
                                (error) => {
                                    this.nznot.create('error', error.code , error.msg);
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });


            } else if (event.names.key  === 'branchDDetail') {
                this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event.guid + '/branchDetail' ,{}, {Authorization: this.token})
                    .subscribe(
                        (val) => {
                             this.branchInfo = true;
                             this.branchData = val.result;
                             this.branchData.createTime = moment(this.branchData.createTime).format('YYYY-MM-DD');
                        },
                        (error) => {
                            this.nznot.create('error', error.code , error.msg);
                        });
            } else {

                this.modal.open({
                    title: '取消工作项',
                    content: '您是否确定取消工作项?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.utilityService.putData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + event.guid + '/status' ,{}, {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    this.nznot.create('success', val.msg , val.msg);
                                    this.getData();
                                }
                            );
                    },
                    onCancel: () => {

                    }
                });
            }
        }
    }

    subProject(){
        let projectGuids = []
        // this.projectInfo = false;
        for (let i = 0 ; i < this.list.length; i ++) {
                if (this.list[i].status === 'right' && this.list[i].disabled === false) {
                projectGuids.push(this.list[i].guid);
            }
        }
          this.utilityService.postData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + this.workId + '/project' ,{projectGuids: projectGuids}, {Authorization: this.token})
                            .subscribe(
                                (val) => {
                                    this.projectInfo = false;
                                    this.nznot.create('success', val.msg , val.msg);
                                    this.getData();
                                } ,
                            (error) => {
                                if (error) {
                                       this.nznot.create('error', error.msg, '');
                                }}
                            );
            }
    isShowArtf = false;

    checkArtf(event){
        let MOBILE_REGEXP =/^\+?[1-9][0-9]*$/;
        console.log(MOBILE_REGEXP.test(event));
        if(MOBILE_REGEXP.test(event)==true){
            this.isShowArtf = false
        }else{
            this.isShowArtf = true;
        }
    }
    // 选中复选框方法
    selectedRow(event) {

    }


    checkBranch(guid) {
        console.log(guid)
        this.utilityService.getData(appConfig.testUrl  + appConfig.API.sBranchadd + '/' + guid,   {}, {Authorization: this.token})
            .subscribe(
                (val) => {
                  this.branchData = val.result;
                  this.branchdataInfo = true; // 默认不显示详情
                  this.branchData.createTime = moment(this.branchData.createTime).format('YYYY-MM-DD');
                }
            );
    }

    // 弹出框确定

    save() {
        this.workAdd.receiveTime = moment(this.workAdd.receiveTime).format('YYYY-MM-DD');
        this.workAdd.developStartTime = moment(this.workAdd.developStartTime).format('YYYY-MM-DD');
        this.workAdd.deliveryTime = moment(this.workAdd.deliveryTime).format('YYYY-MM-DD');
        this.workAdd.deliveryPlanTime = moment(this.workAdd.deliveryPlanTime).format('YYYY-MM-DD');

        if (_.isArray(this.workAdd.developers)) {
            this.workAdd.developers = this.workAdd.developers.join( ',' );
        } else {
        }
        if(this.isShowArtf === true) {
            this.nznot.create('error', 'ARTF格式不正确', '请检查ARTF');
            return;
        }

        if (!this.workAdd.itemName || !this.workAdd.seqno || !this.workAdd.developers || !this.workAdd.owner || !this.workAdd.requirementDesc ) {
            this.nznot.create('error', '信息不全！', '请检查信息是否完整');
            return;
        }
        if (this.isEdit) { // 修改
            this.utilityService.putData(appConfig.testUrl  + appConfig.API.sWorkitem , this.workAdd, {Authorization: this.token})
                .subscribe(
                    (val) => {
                        this.nznot.create('success', val.msg , val.msg);
                        this.getData();
                     this.modalVisible = false;
                    },
                    error => {
                        this.nznot.create('error', error.code , error.msg);
                    }
                )
            ;
        } else {
            this.utilityService.postData(appConfig.testUrl  + appConfig.API.sWorkitem, this.workAdd,  {Authorization: this.token})
                .subscribe(
                    (val) => {
                      console.log(val)
                        if (val.code === '200') {
                             this.modalVisible = false;
                              this.modal.open({
                                title: '信息提示',
                                content: val.msg + '是否需要立即关联分支？',
                                okText: '确定',
                                cancelText: '取消',
                                onOk: () => {
                                    this.workId = val.result.guid
                                    this.assVisible = true;

                                },
                                onCancel: () => {

                                }
                            });
                        }else{
                              this.nznot.create('error', val.msg , val.msg);
                        }

                        this.getData();
                    },
                    error => {
                        this.nznot.create('error', error.code , error.msg);
                    }
                );

        }


    }


    // 关联分支
    assSave() {
        let url = '';
        if (this.active === true){ // 选择已有分支
         if (this.assbranch == undefined){
              this.nznot.create('error', '请输入完整分支信息', '');
             return;
         }
         this.utilityService.getData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + this.exitInfo.guid + '/branch/'  + this.assbranch,   {}, {Authorization: this.token})
            .timeout(5000)
            .subscribe(
                (val) => {
                 this.getData();
                 this.assVisible = false;
                 this.nznot.create('success', val.msg, val.msg);
                }
                ,
                    error => {
                        this.nznot.create('error', error.code , error.msg);
                    }
            );
        }else{
            let id ='';
            console.log(this.addBranch)
            if(this.addBranch.branchFor == null || this.addBranch.branchType == null){
                 this.nznot.create('error', '请输入完整分支信息', '');
                 return;
            }
             if  (this.workId) {
                 id = this.workId;
             }else {
                  id = this.exitInfo.guid;
             };
           this.utilityService.postData(appConfig.testUrl  + appConfig.API.sWorkitem + '/' + id + '/branch',  this.addBranch, {Authorization: this.token})
            .timeout(5000)
            .subscribe(
                (val) => {
                      this.assVisible = false;
                    this.getData();
                    this.nznot.create('success', val.msg, val.msg);
                }
                ,
                    error => {
                        this.nznot.create('error', error.code , error.msg);
                    }
            );
        }

    }
}
