import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormEnvironmentalVariableFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-environmental-variable-form-element',
    templateUrl: './build-definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddEnvironmentalVariableFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormEnvironmentalVariableFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormEnvironmentalVariableFormElement> =
        new EventEmitter<BuildDefinitionAddFormEnvironmentalVariableFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }
}
