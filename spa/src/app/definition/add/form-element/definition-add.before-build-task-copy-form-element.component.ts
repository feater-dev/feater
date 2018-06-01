import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {DefinitionAddFormBeforeBuildCopyTaskFormElement} from '../../definition-add-form.model';

@Component({
    selector: 'app-definition-add-before-build-task-copy-form-element',
    templateUrl: './definition-add.before-build-task-copy-form-element.component.html',
    styles: []
})
export class DefinitionAddBeforeBuildTaskCopyFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormBeforeBuildCopyTaskFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormBeforeBuildCopyTaskFormElement> =
        new EventEmitter<DefinitionAddFormBeforeBuildCopyTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
