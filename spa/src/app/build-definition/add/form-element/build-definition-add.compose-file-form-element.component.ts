import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {
    BuildDefinitionAddFormSourceFormElement,
    BuildDefinitionAddComposeFileFormElement
} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-compose-file-form-element',
    templateUrl: './build-definition-add.compose-file-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddComposeFileFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddComposeFileFormElement;

    @Input() sources: BuildDefinitionAddFormSourceFormElement[];

    ngOnInit() {}

    addComposeFileRelativePath(): void {
        this.item.composeFileRelativePaths.push('');
    }

    onDeleteComposeFileRelativePath(index: number) {
        this.item.composeFileRelativePaths.splice(index, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
