import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {DefinitionAddFormEnvironmentalVariableFormElement} from '../../definition-add-form.model';

@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl: './definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class DefinitionAddEnvironmentalVariableFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormEnvironmentalVariableFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormEnvironmentalVariableFormElement> =
        new EventEmitter<DefinitionAddFormEnvironmentalVariableFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }
}
