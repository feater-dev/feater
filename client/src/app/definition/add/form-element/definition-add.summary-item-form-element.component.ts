import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SummaryItemFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-summary-item-form-element',
    templateUrl: './definition-add.summary-item-form-element.component.html',
    styles: [],
})
export class DefinitionAddSummaryItemFormElementComponent {
    @Input() summaryItem: SummaryItemFormElement;

    @Output() deleteSummaryItem: EventEmitter<
        SummaryItemFormElement
    > = new EventEmitter<SummaryItemFormElement>();

    delete(): void {
        this.deleteSummaryItem.emit(this.summaryItem);
    }
}
