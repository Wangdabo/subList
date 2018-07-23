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
    deliveryResult:any[];
    @Input()
    deliveryTime: any;
    @Input()
    isNext: boolean;
    @Input()
    iStouchan: boolean;
    @Input()
    istextVisible:boolean;
    @Input()
    checkStatus:boolean;
    @Input()
    title:any;
    // @Input()
    //  loading:boolean;
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
    loading1:boolean;
     @Input()
    loading2:boolean;
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
        patchType:''

    }]
   returnID:any;

    // deliveryTime
    constructor(private http: _HttpClient,
                public msg: NzMessageService,) {

    }

    ngOnInit() {
        this.elementScice = this.elementScice;
        this.checkloading = false;
        // this.title =  this.title;
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
     errorId:any;
    sonbuttonClick(index,it,suoyin) {
          console.log(it)
         this.arr = [{
        guidDelivery:'',
        deployWhere:'',
        patchType:''

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
           
            this.errorId=it.guid
             break;
              case 4:
            this.errorId=it.guid
                // it.checkbuttons = true;
                //   it.confirmStatus = '加入投放'
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
    sonreturnsclick(index,it){
        // let guid = it
        if(index == 0){
            this.istextVisible = true
            this.returnID = it
            // guid = it.guid;
        }else{
        //   if(index == 1){
        //     guid = it.guid;
        //     }
            let obj = {
                index:index,
                it : it,
                        }
            // console.log(obj)
            this.returnsclick.emit(obj)
            if(index == 2 ){
            this.istextVisible = false
                  }
        }
       
     
    }

 
    soncheckSave(){
      
          this.errorId;
          let obj=
              {
                  arr:this.arr,
                  errorId:this.errorId
              }
          
            this.checkSave.emit(obj)
    }

 }