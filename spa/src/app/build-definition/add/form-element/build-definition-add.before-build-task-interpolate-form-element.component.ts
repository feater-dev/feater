import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-before-build-task-interpolate-form-element',
    templateUrl: './build-definition-add.before-build-task-interpolate-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddBeforeBuildTaskInterpolateFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement> =
        new EventEmitter<BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
