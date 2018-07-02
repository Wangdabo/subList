import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeService {
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }


    clearMessage() {
        this.subject.next();
    }


    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}
