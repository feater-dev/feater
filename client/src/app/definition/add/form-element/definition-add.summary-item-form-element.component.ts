import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionSummaryItemFormElement} from '../../config-form/definition-config-form.model';


@Component({
    selector: 'app-definition-add-summary-item-form-element',
    templateUrl: './definition-add.summary-item-form-element.component.html',
    styles: []
})
export class DefinitionAddSummaryItemFormElementComponent implements OnInit {

    @Input() summaryItem: DefinitionSummaryItemFormElement;

    @Output() deleteSummaryItem: EventEmitter<DefinitionSummaryItemFormElement> =
        new EventEmitter<DefinitionSummaryItemFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteSummaryItem.emit(this.summaryItem);
    }

}
