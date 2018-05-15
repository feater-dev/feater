import { environment } from './../../../environments/environment';

import { Inject, Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthHttp } from '../../api/auth-http';
import { User } from '../user.model';

@Injectable()
export class UserRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/user`;

    constructor(
        @Inject('authHttp') private http: AuthHttp,
    ) {}

    getItems(): Observable<User[]> {
        return this.http
            .get(this.itemsUrl)
            .map((res): User[] => res.json().data)
            .catch(this.handleError);
    }

    getItem(id: string): Observable<User> {
        return this.http
            .get([this.itemsUrl, id].join('/'))
            .map((res): User => res.json().data)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // TODO
        console.log('Error in user repository', error);

        return Observable.throw('Error in user repository');
    }
}
