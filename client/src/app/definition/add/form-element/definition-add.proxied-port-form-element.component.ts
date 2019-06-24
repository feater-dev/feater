import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionProxiedPortFormElement} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-proxied-port-form-element',
    templateUrl: './definition-add.proxied-port-form-element.component.html',
    styles: []
})
export class DefinitionAddProxiedPortFormElementComponent {

    @Input() proxiedPort: DefinitionProxiedPortFormElement;

    @Output() deleteProxiedPort: EventEmitter<DefinitionProxiedPortFormElement> =
        new EventEmitter<DefinitionProxiedPortFormElement>();

    delete() {
        this.deleteProxiedPort.emit(this.proxiedPort);
    }

}
