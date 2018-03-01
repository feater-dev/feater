import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { BuildDefinition } from '../build-definition.model';
import {
    BuildDefinitionAddForm, BuildDefinitionAddFormComponentFormElement,
    BuildDefinitionAddFormEnvironmentalVariableFormElement, BuildDefinitionAddFormExposedPortFormElement
} from '../build-definition-add-form.model';

@Injectable()
export class BuildDefinitionRepositoryService {

    private itemsUrl = 'http://feat.local:3000/api/build-definition';

    constructor(private http: Http) {}

    getItems() : Observable<BuildDefinition[]> {
        return this.http
            .get(this.itemsUrl)
            .map((res) : BuildDefinition[] => res.json().data)
            .catch(this.handleError);
    }

    getItem(id : string) : Observable<BuildDefinition> {
        return this.http
            .get([this.itemsUrl, id].join('/'))
            .map((res) : BuildDefinition => res.json().data)
            .catch(this.handleError);
    }

    addItem(item : Object) : Observable<string> {
        return this.http
            .post(this.itemsUrl, item)
            .map((res) : string => res.json().data.id)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // TODO
        console.log('Error in build definition repository', error);

        return Observable.throw('Error in build definition repository');
    }
}
