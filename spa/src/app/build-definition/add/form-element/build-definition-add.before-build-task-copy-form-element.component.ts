import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormBeforeBuildCopyTaskFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-before-build-task-copy-form-element',
    templateUrl: './build-definition-add.before-build-task-copy-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddBeforeBuildTaskCopyFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormBeforeBuildCopyTaskFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormBeforeBuildCopyTaskFormElement> =
        new EventEmitter<BuildDefinitionAddFormBeforeBuildCopyTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
