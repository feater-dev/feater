/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {DefinitionRepositoryService} from './definition-repository.service';

describe('DefinitionRepositoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DefinitionRepositoryService]
        });
    });

    it('should ...', inject([DefinitionRepositoryService], (service: DefinitionRepositoryService) => {
        expect(service).toBeTruthy();
    }));
});
