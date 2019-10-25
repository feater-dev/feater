import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DownloadableFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-downloadable-form-element',
    templateUrl: './definition-add.downloadable-form-element.component.html',
    styles: [],
})
export class DefinitionAddDownloadableFormElementComponent {
    @Input() item: DownloadableFormElement;

    @Output() deleteItem: EventEmitter<
        DownloadableFormElement
    > = new EventEmitter<DownloadableFormElement>();

    delete() {
        this.deleteItem.emit(this.item);
    }
}
