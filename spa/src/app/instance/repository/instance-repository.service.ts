import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetInstanceResponseDto} from '../instance-response-dtos.model';


@Injectable()
export class InstanceRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/instance`;

    constructor(
        private httpClient: HttpClient
    ) {}

    getItems(): Observable<GetInstanceResponseDto[]> {
        return this.httpClient
            .get<GetInstanceResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetInstanceResponseDto> {
        return this.httpClient
            .get<GetInstanceResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

}
