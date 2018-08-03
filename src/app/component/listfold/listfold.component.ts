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

    // 变量
    expandDataCache = {};
    title= '未确认合并'
    isdisabled = false;
    data: any[] = [];

    // 输入属性
    @Input() // 输入属性,接受父组件传入的数据
    initDate: any[];
    @Input() // 输入属性,接受父组件传递的表头
    headerDate: any[];
    @Input()
    childDate:  any[];
    @Input() // 输入属性,接受父组件传入的数据
    isPagination: any;
    @Input()
    buttons: any; // 操作栏按钮

    // 输出属性
    @Output()
    buttonEvent: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，按钮点击事件，非必选


    ngOnInit() {
        // this.data = this.initDate;
        this.headerDate = this.headerDate;
          console.log(this.initDate)

        }

        // 按钮点击方法
        buttonClick(event, guid) {
            // event.check = true;
            // event.value = '已确认合并'
            const obj = {
                guid: guid,
                event: event
            }
        this.buttonEvent.emit(obj); // 点击了修改，打开弹出框，把修改的数据传递过去

    }


}
