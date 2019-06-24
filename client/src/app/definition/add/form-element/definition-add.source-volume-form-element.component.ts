import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionSourceVolumeFormElement} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-source-volume-form-element',
    templateUrl: './definition-add.source-volume-form-element.component.html',
    styles: []
})
export class DefinitionAddSourceVolumeFormElementComponent implements OnInit {

    @Input() sourceVolume: DefinitionSourceVolumeFormElement;

    @Output() deleteItem: EventEmitter<DefinitionSourceVolumeFormElement> =
        new EventEmitter<DefinitionSourceVolumeFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteItem.emit(this.sourceVolume);
    }

}
