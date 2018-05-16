import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormExposedPortFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-exposed-port-form-element',
    templateUrl: './build-definition-add.exposed-port-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddExposedPortFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormExposedPortFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormExposedPortFormElement> =
        new EventEmitter<BuildDefinitionAddFormExposedPortFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
