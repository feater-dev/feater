import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionSummaryItemFormElement} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-summary-item-form-element',
    templateUrl: './definition-add.summary-item-form-element.component.html',
    styles: []
})
export class DefinitionAddSummaryItemFormElementComponent {

    @Input() summaryItem: DefinitionSummaryItemFormElement;

    @Output() deleteSummaryItem: EventEmitter<DefinitionSummaryItemFormElement> =
        new EventEmitter<DefinitionSummaryItemFormElement>();

    delete(): void {
        this.deleteSummaryItem.emit(this.summaryItem);
    }

}
