import {
    Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges, DoCheck, ViewChild,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
    q: any = { // 定义一个对象
        pi: 1, // 页数
        ps: 10, // 每业个数
        sorter: '',
        status: null,
        statusList: []
    };

    // 使用子组件的方法
    @ViewChild('nzTable')
    table: ListComponent;

    // 变量
    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    header: any[]; // 表头数据
    obj: any[];
    data: any[] = [];
    deplayArray = [];
    isshow = false;

    // 输入属性
    @Input()
    nzShowIcon: boolean; // 图标是否显示
    @Input()
    initDate: any[]; // 初始化列表数据
    @Input()
    headerDate: any[]; // 初始化头部数据
    @Input()
    moreData: any[]; // 初始化上方按钮数据
    @Input()
    total: number; // 列表总数
    @Input()
    showAdd: boolean; // 是否有新增、修改默认按钮
    @Input()
    configTitle: string; // 配置按钮
    @Input()
    buttons: any; // 操作栏按钮
    @Input()
    isPagination: any; //
    @Input()
    parsentList: any; // 传输对象
    @Input()
    parsentbool: any; // 传递单个/多个
    @Input()
    pageTotal: number; // list页码总数
    @Input()
    pageindex: number; // list 当前页码
    @Input()
    deleteTitle: string;
    @Input()
    isShowTotal: boolean; // 是否显示总数
    @Input()
    isShowTotalhead: boolean; // 是否显示头部
    @Input()
     switch: boolean; // switch开关

    // 输出属性
    @Output()
    addCreat: EventEmitter<string> = new EventEmitter(); // 新增、修改按钮方法输出

    @Output()
    pageNumber: EventEmitter<number> = new EventEmitter(); // 翻页方法输出

    @Output()
    deleatData: EventEmitter<any> = new EventEmitter(); // 删除方法输出

    @Output()
    isActive: EventEmitter<any> = new EventEmitter(); // 点击list字段内容跳转方法

     @Output()
     buttonData: EventEmitter<any> = new EventEmitter(); // 按钮方法

    @Output()
    selectedRow: EventEmitter<any> = new EventEmitter(); // 选中checkbox方法

    @Output()
    buttonEvent: EventEmitter<any> = new EventEmitter(); // 自定义按钮方法

    @Output()
    getStatus: EventEmitter<any> = new EventEmitter(); // 改变状态方法

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
    ) {
    }

    // 初始化方法
    ngOnInit() {
        this.headerDate = this.headerDate;
        this.moreData = this.moreData; // 绑定更多数据
        this.checkTotal();


    }

    // 是否显示总数
    checkTotal() {
     if (this.isShowTotalhead === undefined){
         this.isShowTotalhead = true;
     }
    }

    // 打开模态框方法,点击之后应该往外部发射事件，告诉父组件点击了这个按钮
    add(event) {
        if (event !== undefined) {
            this.addCreat.emit(event); // 点击了修改，打开弹出框，把修改的数据传递过去
        }
    }


    // 点击按钮方法
    buttonClick(event, Name, index) {
        if (Name) {
            event.names = Name;
            if (this.parsentbool ) { // 判断标识是否为true，如果是true则传递两个
                const obj = {
                    data: event,
                    parList: this.parsentList,
                    index: index,
                };
                this.buttonEvent.emit(obj); // 点击了修改，打开弹出框，把修改的数据传递过去
            } else {
                this.buttonEvent.emit(event); // 点击了修改，打开弹出框，把修改的数据传递过去
            }

        } else {
            this.buttonEvent.emit(event); // 点击了修改，打开弹出框，把修改的数据传递过去
        }


    }

    // 点击事件方法
    isClick(d, i) {
        if (d.isclick === true) {
            this.isActive.emit(i); // 此时，代表允许有行为，至于是路由跳转还是弹出框 父组件中进行定义和修改
        }
    };


    // 移除数据方法
    remove() {
        this.deleatData.emit(this.selectedRows); // 把要删除的内容发射给父组件
        this.clear();
    }

    // 点击list更多操作按钮方法
    moreclick(event) {
        const obj = {
            key: this.selectedRows[0],
            value: event
        };
        this.buttonData.emit(obj); // 把要删除的内容发射给父组件
    }

    // 清空方法
    clear() {
        this.selectedRows = [];
        this.totalCallNo = 0;
        this.initDate.forEach(i => i.checked = false);
        this.refreshStatus();
    }


    //  全选方法
    checkAll(value: boolean) {
        // 因为dataChange方法无效，直接使用table的实例和属性，拿到整页的数据，也可以使用initDate，不过这个更直接
        this.table.data.forEach(i => {
            if (!i.disabled) i.checked = value;
        });
        this.refreshStatus();
    }


    // switch 状态改变方法
    status(i, event) {
        i.status = event;
        i.switch = false;
        this.getStatus.emit(i); // 把要删除的内容发射给父组件
    }


    // 全选方法底层方法
    refreshStatus() {
       /* const allChecked = this.curRows.every(value => value.disabled || value.checked);
        const allUnChecked = this.curRows.every(value => value.disabled || !value.checked);*/
        const allChecked = this.initDate.every(value => value.disabled || value.checked);
        const allUnChecked = this.initDate.every(value => value.disabled || !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.selectedRows = this.initDate.filter(value => value.checked);
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);

        const obj = {
            indeterminate: this.indeterminate,
            selectedRows: this.selectedRows,
        }
        this.selectedRow.emit(obj); // 把是否旋转和选中的内容传出去
    }


    // 翻页方法
    pageChange(pi: number): Promise<any> {
        this.q.pi = pi;
        this.loading = true;
        this.allChecked = false; // 全选干掉
        this.selectedRows = []; // 数据清空
        this.indeterminate = false; // 单选也清空
        this.pageNumber.emit(pi); // 发射出去，把当前的页数发射出去
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }


    // 重置方法
    reset(ls: any[]) {
        for (const item of ls) item.value = false;
        // this.getData();
    }


    // 比较方法，提清单config 工程级联方法
    onChanges(p, d, a, l) { // 选择值和完整json数组
        l.isshow = true; // 显示部署为
        let obj = {}
        var arr;
        for (let i  in d){
            console.log(d[i])
            if (i === p) {
                arr = d[i].split(',');
                for (let s = 0; s < arr.length; s++) {
                    obj = {
                        value: arr[s],
                        label: arr[s],
                    }
                    a.push(obj);
                }
            }
        }
    }

}
