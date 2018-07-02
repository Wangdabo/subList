import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Tree, TreeModule} from 'primeng/tree';
import {MenuItem,  TreeNode, Message} from 'primeng/api';
import { TreeDragDropService } from 'primeng/api';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrls: ['./tree.scss'],
   providers: [TreeDragDropService]
})

export class TreeDemoComponent implements OnInit, OnChanges {

    files: TreeNode[];
    selectedFiles: TreeNode[];
    items: MenuItem[];
    title: string;
    searsh: string; // 搜索框内容
    @Input() // 输入属性,接受父组件传入的树数据
    initDate: any[];


    @Input() // 输入属性,接受父组件传入的右击菜单数据
    itemsData: MenuItem[];

    @Input() // 输入属性,接受父组件传入的树搜索框内容文字
    searchTitle: string;


    @Input() // 输入属性,接受父组件传入的树搜索框内容文字
    nodrop: boolean;



    @Output()
    dropEvent: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
    @Output()
    inputValue: EventEmitter<string> = new EventEmitter();

    @Output()
    serchValue: EventEmitter<any> = new EventEmitter();

    @Output()
    MenuSelect: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去


    @Output()
    Select: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去


    @Output()
    develop: EventEmitter<string> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

    constructor() {
    }


    ngOnInit() {
        this.getData(); // 初始化树数据
        this.searchaValue(); // 搜索值
        console.log(this.nodrop);

    }


    ngOnChanges(changes: SimpleChanges): void { // 监听 当父组件发生改变的时候，调用初始化数据方法
        this.getData();
    }


    getData() {
        this.files = this.initDate; // 把父组件传输过来的数据，绑定给files数组，完成页面tree页面渲染
        this.items = this.itemsData; // 父组件 传入的右击菜单数据
        this.selectedFiles = this.files; // 选中节点属性
        this.title = this.searchTitle; // 搜索框的内容文字
    }


    select($event) {
        this.dropEvent.emit($event); // 发生了拖拽，把拖拽事件发射出去，父组件进行处理
    }


    // 搜索框内传递
    searchaValue() {
        const change = document.getElementById( 'searchaVal');
        const change$ = Observable.fromEvent(change, 'keyup').pluck('target', 'value').debounceTime(300);
        change$.subscribe(val  => {
           this.serchValue.emit(val); // 把搜索值发射出去
        });
    }

    // 展开事件
    Unfold(event) {
        this.develop.emit(event); // 展开了节点树信息
    }

    // 右击菜单事件
    RightSelect(event) {
        this.MenuSelect.emit(event); // 进行了右击，到父组件中去定位右击菜单数据
    }


    // 左击选中事件
    NodeSelect(event) {
        this.Select.emit(event); // 点击了树节点，把节点信息传过去
    }



}



