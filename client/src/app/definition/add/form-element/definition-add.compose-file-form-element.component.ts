import { Component, Input } from '@angular/core';
import {
    SourceFormElement,
    ComposeFileFormElement,
} from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-compose-file-form-element',
    templateUrl: './definition-add.compose-file-form-element.component.html',
    styles: [],
})
export class DefinitionAddComposeFileFormElementComponent {
    @Input() composeFile: ComposeFileFormElement;

    @Input() sources: SourceFormElement[];

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
