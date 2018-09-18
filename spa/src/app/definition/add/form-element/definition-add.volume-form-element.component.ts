import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    DefinitionAddFormVolumeFormElement,
    DefinitionAddFormBeforeBuildTaskFormElement,
    DefinitionAddFormBeforeBuildCopyTaskFormElement,
    DefinitionAddFormBeforeBuildInterpolateTaskFormElement,
} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-volume-form-element',
    templateUrl: './definition-add.volume-form-element.component.html',
    styles: []
})
export class DefinitionAddVolumeFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormVolumeFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormVolumeFormElement> =
        new EventEmitter<DefinitionAddFormVolumeFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
