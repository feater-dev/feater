/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BuildInstanceRepositoryService } from './build-instance-repository.service';

describe('BuildInstanceRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BuildInstanceRepositoryService]
        });
    });

    it('should ...', inject([BuildInstanceRepositoryService], (service: BuildInstanceRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
