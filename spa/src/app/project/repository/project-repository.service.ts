import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetProjectResponseDto, AddProjectResponseDto} from '../project-response-dtos.model';
import {ProjectAddForm} from '../project-add-form.model';

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

    addItem(item: ProjectAddForm): Observable<AddProjectResponseDto> {
        return this.httpClient
            .post<AddProjectResponseDto>(
                this.itemsUrl,
                item,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
