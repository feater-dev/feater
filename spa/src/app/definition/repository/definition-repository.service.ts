import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetDefinitionResponseDto} from '../definition-response-dtos.model';


@Injectable()
export class DefinitionRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/definition`;

    constructor(
        private httpClient: HttpClient
    ) {}

    getItems(): Observable<GetDefinitionResponseDto[]> {
        return this.httpClient
            .get<GetDefinitionResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetDefinitionResponseDto> {
        return this.httpClient
            .get<GetDefinitionResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
