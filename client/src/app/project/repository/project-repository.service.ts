import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Project } from '../project.model';
import { ProjectAddForm } from '../project-add-form.model';

@Injectable()
export class ProjectRepositoryService {

    private itemsUrl = 'http://localhost:3000/api/project';

    constructor(private http: Http) {}

    getItems() : Observable<Project[]> {
        return this.http
            .get(this.itemsUrl)
            .map((res) : Project[] => res.json().data)
            .catch(this.handleError);
    }

    getItem(id : string) : Observable<Project> {
        return this.http
            .get([this.itemsUrl, id].join('/'))
            .map((res) : Project => res.json().data)
            .catch(this.handleError);
    }

    addItem(item : ProjectAddForm) : Observable<string> {
        return this.http
            .post(this.itemsUrl, item)
            .map((res) : string => res.json().data.id)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // TODO
        console.log('Error in project repository', error);

        return Observable.throw('Error in project repository');
    }
}
