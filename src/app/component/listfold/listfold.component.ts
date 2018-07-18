import {
    Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges, DoCheck, ViewChild,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-listfold',
    templateUrl: './listfold.component.html',
    styleUrls: ['./listfold.component.less']
})
export  class ListfoldComponent implements OnInit {
 
     @ViewChild('nzTable')
    table: ListfoldComponent;
    header: any[]; // 表头数据
    @Input() // 输入属性,接受父组件传入的数据
   initDate: any[];
    @Input() // 输入属性,接受父组件传递的表头
    headerDate: any[];
    @Input()
    childDate:any[];
    expandDataCache = {};
    title= '未确认合并'
   isdisabled = false;
     data:any[] = [];
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
    deleteTitle: string;
    @Input() // 输入属性,接受父组件传入的数据
    isShowTotal: boolean;


    @Output()
    addCreat: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    pageNumber: EventEmitter<number> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    deleatData: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    @Output()
    isActive: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    //  @Output()
    //  buttonData: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    @Output()
    selectedRow: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

    @Output()
    buttonEvent: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选

     
    ngOnInit() {
        // this.data = this.initDate;
        this.headerDate = this.headerDate;
          console.log(this.initDate)
          
        }

        buttonClick(event,guid) {
            // event.check = true;
            // event.value = '已确认合并'
            let obj ={
                guid:guid,
                event:event
            }
        this.buttonEvent.emit(obj); // 点击了修改，打开弹出框，把修改的数据传递过去
         
    }

 
}