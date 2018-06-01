/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {InstanceRepositoryService} from './instance-repository.service';

describe('InstanceRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InstanceRepositoryService]
        });
    });

    it('should ...', inject([InstanceRepositoryService], (service: InstanceRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
