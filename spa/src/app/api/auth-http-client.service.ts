import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from  'rxjs/Observable';
import 'rxjs/add/operator/finally';

export enum Action { QueryStart, QueryStop };

@Injectable()
export class AuthHttpClient {
    process: EventEmitter<any> = new EventEmitter<any>();
    authFailed: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _httpClient: HttpClient) { }

    private _buildAuthHeader(): string {
        return `Bearer ${localStorage.getItem('token')}`;
    }

    public get(url: string, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('GET', url, null, httpRequestHeaders);
    }

    public post(url: string, body: any, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('POST', url, body, httpRequestHeaders);
    }

    public put(url: string, body: any, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('PUT', url, body, httpRequestHeaders);
    }

    public delete(url: string, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('DELETE', url, null, httpRequestHeaders);
    }

    public patch(url: string, body: any, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('PATCH', url, body, httpRequestHeaders);
    }

    public head(url: string, httpRequestHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        return this._request('HEAD', url, null, httpRequestHeaders);
    }

    private _request(method: string, url: string, body?: any, httpHeaders?: HttpHeaders): Observable<HttpResponse<any>> {
        if (!httpHeaders) {
            httpHeaders = new HttpHeaders();
        }

        let httpRequest = new HttpRequest(method, url, body, {
            headers: httpHeaders.set('x-feat-api-token', this._buildAuthHeader()),
        });

        return Observable.create((observer) => {
            this.process.next(Action.QueryStart);
            this._httpClient.request(httpRequest)
                .finally(() => {
                    this.process.next(Action.QueryStop);
                })
                .subscribe(
                    (res) => {
                        observer.next(res);
                        observer.complete();
                    },
                    (err) => {
                        switch (err.status) {
                            case 401:
                                this.authFailed.next(err);
                                observer.error(err);
                                break;
                            default:
                                observer.error(err);
                                break;
                        }
                    });
        });
    }
}
