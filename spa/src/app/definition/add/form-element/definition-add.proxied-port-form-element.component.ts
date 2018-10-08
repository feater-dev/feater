import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionAddFormProxiedPortFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-proxied-port-form-element',
    templateUrl: './definition-add.proxied-port-form-element.component.html',
    styles: []
})
export class DefinitionAddProxiedPortFormElementComponent {

    @Input() item: DefinitionAddFormProxiedPortFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormProxiedPortFormElement> =
        new EventEmitter<DefinitionAddFormProxiedPortFormElement>();

    delete() {
        this.deleteItem.emit(this.item);
    }

}
