import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetBuildInstanceResponseDto, AddBuildInstanceResponseDto} from '../build-instance-response-dtos.model';
import {BuildInstanceAddForm} from '../build-instance-add-form.model';


@Injectable()
export class BuildInstanceRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/build-instance`;

    constructor(
        private httpClient: HttpClient
    ) {}

    getItems(): Observable<GetBuildInstanceResponseDto[]> {
        return this.httpClient
            .get<GetBuildInstanceResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetBuildInstanceResponseDto> {
        return this.httpClient
            .get<GetBuildInstanceResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    addItem(item: BuildInstanceAddForm): Observable<AddBuildInstanceResponseDto> {
        return this.httpClient
            .post<AddBuildInstanceResponseDto>(
                this.itemsUrl,
                item,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
