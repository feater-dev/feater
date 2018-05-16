import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormSummaryItemFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-summary-item-form-element',
    templateUrl: './build-definition-add.summary-item-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddSummaryItemFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormSummaryItemFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormSummaryItemFormElement> =
        new EventEmitter<BuildDefinitionAddFormSummaryItemFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
