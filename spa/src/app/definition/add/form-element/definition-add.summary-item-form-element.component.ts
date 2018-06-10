import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionAddFormSummaryItemFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-summary-item-form-element',
    templateUrl: './definition-add.summary-item-form-element.component.html',
    styles: []
})
export class DefinitionAddSummaryItemFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormSummaryItemFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormSummaryItemFormElement> =
        new EventEmitter<DefinitionAddFormSummaryItemFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
