import {Component, Input} from '@angular/core';
import {DefinitionSourceFormElement, DefinitionAddComposeFileFormElement} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-compose-file-form-element',
    templateUrl: './definition-add.compose-file-form-element.component.html',
    styles: []
})
export class DefinitionAddComposeFileFormElementComponent {

    @Input() composeFile: DefinitionAddComposeFileFormElement;

    @Input() sources: DefinitionSourceFormElement[];

    addComposeFileRelativePath(): void {
        this.composeFile.composeFileRelativePaths.push('');
    }

    deleteComposeFileRelativePath(index: number): void {
        this.composeFile.composeFileRelativePaths.splice(index, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
