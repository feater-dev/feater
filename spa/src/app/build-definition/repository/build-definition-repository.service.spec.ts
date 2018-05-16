/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {BuildDefinitionRepositoryService} from './build-definition-repository.service';

describe('BuildDefinitionRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BuildDefinitionRepositoryService]
        });
    });

    it('should ...', inject([BuildDefinitionRepositoryService], (service: BuildDefinitionRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
