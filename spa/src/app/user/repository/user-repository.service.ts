import {environment} from './../../../environments/environment';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {GetUserResponseDto} from '../user-response-dtos';


@Injectable()
export class UserRepositoryService {

    private itemsUrl = `${environment.apiBaseUrl}/user`;

    constructor(
        private httpClient: HttpClient,
    ) {}

    getItems(): Observable<GetUserResponseDto[]> {
        return this.httpClient
            .get<GetUserResponseDto[]>(
                this.itemsUrl,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }

    getItem(id: string): Observable<GetUserResponseDto> {
        return this.httpClient
            .get<GetUserResponseDto>(
                `${this.itemsUrl}/${id}`,
                {
                    headers: (new HttpHeaders())
                        .set('x-feat-api-token', `Bearer ${localStorage.getItem('token')}`),
                }
            );
    }
}
