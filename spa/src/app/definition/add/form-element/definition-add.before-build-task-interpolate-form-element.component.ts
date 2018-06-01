import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {DefinitionAddFormBeforeBuildInterpolateTaskFormElement} from '../../definition-add-form.model';

@Component({
    selector: 'app-definition-add-before-build-task-interpolate-form-element',
    templateUrl: './definition-add.before-build-task-interpolate-form-element.component.html',
    styles: []
})
export class DefinitionAddBeforeBuildTaskInterpolateFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormBeforeBuildInterpolateTaskFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormBeforeBuildInterpolateTaskFormElement> =
        new EventEmitter<DefinitionAddFormBeforeBuildInterpolateTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
