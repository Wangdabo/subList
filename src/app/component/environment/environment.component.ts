import {
    Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges, DoCheck, ViewChild,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-environment',
    templateUrl: './environment.component.html',
    styleUrls: ['./environment.component.less']
    })
export class EnvironmentComponent implements OnInit {
    @Input() // 输入属性,接受父组件传入的数据
    elementScice: any[];
    @Input()
    deliveryTime: any;
    @Input()
    isNext: boolean;
    @Input()
    isShowDate: boolean;
    @Output()
    isActive: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    constructor(private http: _HttpClient,
                public msg: NzMessageService,) {

    }

    ngOnInit() {
        this.elementScice = this.elementScice;
    }

    // 点击方法
    isClick(d, i) {
          if ( d === true && i === true){
            this.isActive.emit(i);
          }

    };

    // 改变的方法
     onChange(item) {
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].guid !== item && this.elementScice[i].check === true) {
                this.elementScice[i].check = false;
            }
        }

    }

 }
