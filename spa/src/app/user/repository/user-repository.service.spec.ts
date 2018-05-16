/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {UserRepositoryService} from './user-repository.service';

describe('UserRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserRepositoryService]
        });
    });

    it('should ...', inject([UserRepositoryService], (service: UserRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
