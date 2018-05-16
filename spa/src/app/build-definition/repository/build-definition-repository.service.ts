import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {GetBuildDefinitionResponseDto, AddBuildDefinitionResponseDto} from '../build-definition-response-dtos.model';
import {BuildDefinitionAddForm} from '../build-definition-add-form.model';

@Injectable()
export class BuildDefinitionRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/build-definition`;

    constructor(
        private httpClient: HttpClient
    ) {}

    getItems(): Observable<GetBuildDefinitionResponseDto[]> {
        return this.httpClient
            .get<GetBuildDefinitionResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetBuildDefinitionResponseDto> {
        return this.httpClient
            .get<GetBuildDefinitionResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    addItem(item: BuildDefinitionAddForm): Observable<AddBuildDefinitionResponseDto> {
        return this.httpClient
            .post<AddBuildDefinitionResponseDto>(
                this.itemsUrl,
                item,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
