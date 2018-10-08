import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    DefinitionAddFormSourceFormElement,
    DefinitionAddComposeFileFormElement
} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-compose-file-form-element',
    templateUrl: './definition-add.compose-file-form-element.component.html',
    styles: []
})
export class DefinitionAddComposeFileFormElementComponent implements OnInit {

    @Input() item: DefinitionAddComposeFileFormElement;

    @Input() sources: DefinitionAddFormSourceFormElement[];

    ngOnInit() {}

    addComposeFileRelativePath(): void {
        this.item.composeFileRelativePaths.push('');
    }

    deleteComposeFileRelativePath(index: number) {
        this.item.composeFileRelativePaths.splice(index, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
