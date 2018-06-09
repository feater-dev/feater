import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionAddFormEnvVariableFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl: './definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class DefinitionAddEnvVariableFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormEnvVariableFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormEnvVariableFormElement> =
        new EventEmitter<DefinitionAddFormEnvVariableFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }
}
