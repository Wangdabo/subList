import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.less']
})
export class FooterComponent implements OnInit {

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {

    }

}
