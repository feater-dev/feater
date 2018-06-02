import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetProjectResponseDto} from '../project-response-dtos.model';


@Injectable()
export class ProjectRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/project`;

    constructor(
        private httpClient: HttpClient
    ) {}

    getItems(): Observable<GetProjectResponseDto[]> {
        return this.httpClient
            .get<GetProjectResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetProjectResponseDto> {
        return this.httpClient
            .get<GetProjectResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
