import {
    Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges, DoCheck, ViewChild,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-mergelist',
    templateUrl: './mergelist.component.html',
    styleUrls: ['./mergelist.component.less']
    })
export class MergelistComponent implements OnInit {

    // 变量
    errorId: any;

    // 输入属性
    @Input() // 输入属性,接受父组件传入的数据
    elementScice: any[];
    @Input()
    deliveryResult:any[];
    @Input()
    deliveryTime: any;
    @Input()
    isNext: boolean;
    @Input()
    iStouchan: boolean;
    @Input()
    istextVisible: boolean;
    @Input()
    checkStatus: boolean;
    @Input()
    title: any;
    @Input()
    checkModalData: any[];
    @Input()
    mergeListData: any[];
    @Input()
    guidprent: any[];
    @Input()
    guid: any;
    @Input()
    checkloading: boolean;
    @Input()
    loading1: boolean;
     @Input()
    loading2: boolean;
    @Output()

    // 输出属性
    isActive: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
    @Output()
    buttonClick: EventEmitter<any> = new EventEmitter();
    @Output()
    mergeClick: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
    @Output()
    returnsclick: EventEmitter<any> = new EventEmitter();
    @Output()
    checkSave: EventEmitter<any> = new EventEmitter();

    arr = [{
        guidDelivery: '',
        deployWhere: '',
        patchType: ''

    }]
   returnID: any;

    // deliveryTime
    constructor(private http: _HttpClient,
                public msg: NzMessageService,) {

    }

    ngOnInit() {
        this.elementScice = this.elementScice;
        this.checkloading = false;
    }

    // 点击方法
    isClick(d, i) {

          if (d === true && i === true) {
            this.isActive.emit(i);
          }


    }

     onChange(item) {
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].guid !== item && this.elementScice[i].check === true) {
                this.elementScice[i].check = false;
            }
        }

    }

    sonmergeClick(index) {
        this.mergeClick.emit(index);
    }

    sonbuttonClick(index, it, suoyin) {
         this.arr = [{
            guidDelivery: '',
            deployWhere: '',
            patchType: ''
    }]


        switch(index){
            case 1:
               it.buttons = true;
             it.confirmStatus = '已合并'


             break;
              case 2:
               it.buttons = false;
             it.confirmStatus = '不投产'

             break;
              case 3:

            this.errorId = it.guid
             break;
              case 4:
            this.errorId = it.guid
             break;
        }

        let obj = {
            index:index,
            id : it.guid,
            soyin: suoyin

        }
        this.buttonClick.emit(obj)
     
    }

    sonreturnsclick(index, it) {
        // let guid = it
        if (index === 0) {
            this.istextVisible = true
            this.returnID = it;
        }else {
            let obj = {
                index: index,
                it : it,
                        }
            this.returnsclick.emit(obj)
            if (index === 2 ) {
            this.istextVisible = false;
           }
        }


    }

    soncheckSave(){
          this.errorId;
          let obj = {
                  arr: this.arr,
                  errorId: this.errorId
              };
            this.checkSave.emit(obj);
            console.log(this.iStouchan);
    }
 }
