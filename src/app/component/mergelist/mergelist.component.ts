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
    @Input() // 输入属性,接受父组件传入的数据
    elementScice: any[];
    @Input()
    deliveryTime: any;
    @Input()
    isNext: boolean;
    @Input()
    iStouchan: boolean;
    @Input()
    istextVisible:boolean;
    @Input()
    checkModalData:any[];
    @Input()
    mergeListData:any[];
    @Input()
    guidprent:any[];
    @Input()
    guid:any;
    @Input()
    checkloading:boolean;
    @Input()
    loading:boolean;
    @Output()

    isActive: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
    @Output()
    buttonClick: EventEmitter<any> = new EventEmitter();
    @Output()
    mergeClick: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
    @Output()
    returnsclick:EventEmitter<any> = new EventEmitter();
    @Output()
    checkSave:EventEmitter<any> = new EventEmitter();

    arr = [{
        guidDelivery:'',
        deployWhere:'',
        patchType:'',

    }]

    // deliveryTime
    constructor(private http: _HttpClient,
                public msg: NzMessageService,) {

    }

    ngOnInit() {
        this.elementScice = this.elementScice;
        this.checkloading = false;
        this.loading = false;
         console.log(this.guidprent);
    }

      isClick(d,i) {

          if(d == true && i == true){
            this.isActive.emit(i)
          }
            // 此时，代表允许有行为，至于是路由跳转还是弹出框 父组件中进行定义和修改
        
    };

     onChange(item) {
        for (let i = 0; i < this.elementScice.length; i ++) {
            if (this.elementScice[i].guid !== item && this.elementScice[i].check === true) {
                this.elementScice[i].check = false;
            }
        }

    }
    sonmergeClick(index) {
      
        this.mergeClick.emit(index)
    }
    sonbuttonClick(index,it,suoyin) {
          console.log(it)
         this.arr = [{
        guidDelivery:'',
        deployWhere:'',
        patchType:'',

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
            //   it.check = false;
             break;
              case 4:
           
                // it.check = true;
         this.iStouchan = true;
             break;
        }
          console.log(it)
        
        let obj = {
            index:index,
            id : it.guid,
            soyin: suoyin

        }
        this.buttonClick.emit(obj)
    }
    sonreturnsclick(index,id){
        if(index == 0){
            this.istextVisible = true
        }
         let obj = {
            index:index,
            id : id
        }
        this.returnsclick.emit(obj)
    }

 
    soncheckSave(){
        this.arr.forEach(element => {
            console.log(element)
        });
            this.checkSave.emit(this.arr)
    }

 }