/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {ProjectRepositoryService} from './project-repository.service';

describe('ProjectRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProjectRepositoryService]
        });
    });

    it('should ...', inject([ProjectRepositoryService], (service: ProjectRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
