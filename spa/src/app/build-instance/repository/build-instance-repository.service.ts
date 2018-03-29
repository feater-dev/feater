import {Inject, Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { BuildInstance } from '../build-instance.model';
import { BuildInstanceAddForm } from '../build-instance-add-form.model';
import {AuthHttp} from '../../api/auth-http';

@Injectable()
export class BuildInstanceRepositoryService {

    private itemsUrl = 'http://localhost:3001/api/build-instance';

    constructor(
        @Inject('authHttp') private http: AuthHttp,
    ) {}

    getItems(): Observable<BuildInstance[]> {
        return this.http
            .get(this.itemsUrl)
            .map((res): BuildInstance[] => res.json().data)
            .catch(this.handleError);
    }

    getItem(id): Observable<BuildInstance> {
        return this.http
            .get([this.itemsUrl, id].join('/'))
            .map((res): BuildInstance => res.json().data)
            .catch(this.handleError);
    }

    addItem(addForm: BuildInstanceAddForm): Observable<string> {
        return this.http
            .post(this.itemsUrl, addForm)
            .map((res): string => res.json().data.id)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // TODO
        console.log('Error in build instance repository', error);

        return Observable.throw('Error in build instance repository');
    }
}
