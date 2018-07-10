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
    mergeListInfo: any[];
    // deliveryTime
    constructor(private http: _HttpClient,
                public msg: NzMessageService,) {

    }

    ngOnInit() {
        this.mergeListInfo = this.mergeListInfo;
    }

 }