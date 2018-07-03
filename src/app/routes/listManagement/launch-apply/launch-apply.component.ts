import { Component, OnInit , Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DeliveryModule} from '../../../service/delivent/deliveryModule';
import {UtilityService} from '../../../service/utils.service';
import {appConfig} from '../../../service/common';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
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
    ngOnInit() {
        this.token  = this.tokenService.get().token;
        this.getData(1);
        this.showAdd = true;
    }

    showAdd: boolean; // 是否有修改
    configTitle = '详情'
    modalVisible = false;
    mergeVisible = false; // 合并投放弹窗
    isPagination = true; // 是否有分页
    // 信息
    deliverItem: DeliveryModule = new  DeliveryModule();
    deliveryTime: any; // 投放日期

    pageTotal: number; // 翻页总数
    dliveryResult = [
        {key: '0', value: '申请中'},
        {key: 'S', value: '成功'},
        {key: 'F', value: '失败'},
        {key: 'C', value: '取消投放'},
    ]

    buttons = [
        {key: 'merge', value: '合并投放', if:true},
        {key: 'checking', value: '核对合并清单',  if:false},
        {key: 'export', value: '导出投放清单',  if:true},
    ]


    data: any[] = []; // 表格数据

    headerData = [  // 配置表头内容
        { value: '工作项', key: 'guidWorkitem', isclick: true, radio: false },
        { value: '别名', key: 'applyAlias', isclick: false, radio: false},
        { value: '投放时间', key: 'deliveryTime', isclick: false, radio: false },
        { value: '运行环境', key: 'guidProfiles', isclick: false, radio: false },
        { value: '申请人', key: 'proposer', isclick: false, radio: false },
        { value: '投放结果', key: 'deliveryResult', isclick: false, radio: false },
        { value: '程序数量', key: 'number', isclick: false, radio: false },
    ];
    // 传入按钮层
    moreData = {
        morebutton: true,
        buttons: [
            { key: 'Overview', value: '查看概况' }
        ]
    }

    test: string;
    page: any;
    total: number;
    pages: number;


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
                    this.data = val.result.records;
                    this.total = val.result.total;//总数
                    this.pageTotal = val.result.pages * 10;//页码
                    for ( var i = 0; i < this.data.length; i++) {
                        // this.data[i].deliveryTime = this.getDate(this.data[i].deliveryTime);
                    }

                },
            );

    }


      //时间处理
      //   getDate(time) {
      //      var str = parseInt(time);
      //       if (!str) {
      //           theDate = " ";
      //       }else {
      //           var oDate = new Date(str);
      //           var oYear = oDate.getFullYear();
      //           var oMonth = oDate.getMonth() + 1;
      //           oMonth = oMonth >= 10? oMonth : '0' + oMonth;
      //           var oDay = oDate.getDate();
      //           oDay = oDay >= 10? oDay : '0' + oDay;
      //           var theDate = oYear + "-" + oMonth  + "-" + oDay;
      //       }
      //       return theDate;
      //   }

    // 列表组件传过来的内容
    addHandler(event) {
         console.log(event)
        if (event === 'merge') {

            this.utilityService.postData(appConfig.testUrl  + appConfig.API.mergeInfo, {}, { Authorization: this.token})
                .map(res => res.json())
                .subscribe(
                    (val) => {

                    },
                );
            this.mergeisVisible = true
            // this.mergeVisible = true;

        } else if (event === 'checking') {
           this.modalVisible = true; // 打开核对弹出框
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

    // 按钮点击事件
    buttonEvent(event) {
        console.log(event);
        // if (event.names === '失败') {
        //     alert('失败的方法')
        // } else if (event.names === '打回') {
        //     alert('打回的方法')
        // } else if (event.names === '成功') {
        //     alert('成功的方法')
        // }

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

    getdatas() {

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


    //打印界面
    isVisible = false; // 默认关闭
    workItem = false;
    mergeisVisible = false;

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


    // 合并的确定
    determine() {
        console.log('确定成功');
        this.mergeVisible = false;
    }
    moreclick() {
        console.log('sssss');
    }


}
