import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    DefinitionVolumeFormElement,
    BeforeBuildTaskFormElement,
    TaskFormElement,
    InterpolateTaskFormElement,
} from '../../config-form/definition-config-form.model';


@Component({
    selector: 'app-definition-add-volume-form-element',
    templateUrl: './definition-add.volume-form-element.component.html',
    styles: []
})
export class DefinitionAddVolumeFormElementComponent implements OnInit {

    @Input() volume: DefinitionVolumeFormElement;

    @Output() deleteItem: EventEmitter<DefinitionVolumeFormElement> =
        new EventEmitter<DefinitionVolumeFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteItem.emit(this.volume);
    }

}
