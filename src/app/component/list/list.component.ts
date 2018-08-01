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

    // 拿到table的实例，获取table的方法和属性
    @ViewChild('nzTable')
    table: ListComponent;


    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    // isShowTotal = true;

    header: any[]; // 表头数据
    obj: any[];
   @Input()
   nzShowIcon:boolean
    @Input() // 输入属性,接受父组件传入的数据
    initDate: any[];
    @Input() // 输入属性,接受父组件传递的表头
    headerDate: any[];
    @Input() // 输入属性,接受按钮层方法
    moreData: any[];
    @Input() // 输入属性,数据总条数
    total: number;
    @Input() // 输入属性,接受父组件传入的数据
    showAdd: boolean;
    @Input() // 输入属性,接受父组件传入的数据
    configTitle: string;
    @Input() // 输入属性,接受父组件传入的数据
    buttons: any;
    @Input() // 输入属性,接受父组件传入的数据
    isPagination: any;
    @Input() // 输入属性,接受父组件传入的数据
    parsentList: any;
    @Input() // 输入属性,接受父组件传入的数据
    parsentbool: any;
    @Input() // 输入属性,接受父组件传入的数据
    pageTotal: number;
    @Input() // 输入属性,接受父组件传入的数据
    pageindex: number;
    @Input() // 输入属性,接受父组件传入的数据
    deleteTitle: string;
    @Input() // 输入属性,接受父组件传入的数据
    isShowTotal: boolean;
    @Input()
    isShowTotalhead:boolean
   @Input()
   switch:boolean
    data: any[] = [];

    @Output()
    addCreat: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    pageNumber: EventEmitter<number> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    deleatData: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    isActive: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

     @Output()
     buttonData: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    @Output()
    selectedRow: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    @Output()
    buttonEvent: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    @Output()
    getStatus: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
    ) {
    }


    ngOnInit() {
        this.headerDate = this.headerDate;
        this.moreData = this.moreData; // 绑定更多数据
        // this.isShowTotalhead = true
        this.checkTotal()

    }

    checkTotal(){
     console.log(this.isShowTotalhead)
     if(this.isShowTotalhead == undefined){
         this.isShowTotalhead = true;
     }
    }

    // 打开模态框方法,点击之后应该往外部发射事件，告诉父组件点击了这个按钮
    add(event) {
        if (event !== undefined) {
            this.addCreat.emit(event); // 点击了修改，打开弹出框，把修改的数据传递过去
        }
    }

    buttonClick(event, Name, index) {
        if (Name) {
            event.names = Name;
            if (this.parsentbool ) { // 如果是true则传递两个
                const obj = {
                    data: event,
                    parList: this.parsentList,
                    index: index,
                }


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
        // this.getData();
        this.clear();
    }


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
    status(i,event) {
        i.status = event
        i.switch = false
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

    deplayArray = [];
    isshow = false;

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
