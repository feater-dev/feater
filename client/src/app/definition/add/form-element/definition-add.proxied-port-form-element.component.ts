import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProxiedPortFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-proxied-port-form-element',
    templateUrl: './definition-add.proxied-port-form-element.component.html',
    styles: [],
})
export class DefinitionAddProxiedPortFormElementComponent {
    @Input() proxiedPort: ProxiedPortFormElement;

    @Output() deleteProxiedPort: EventEmitter<
        ProxiedPortFormElement
    > = new EventEmitter<ProxiedPortFormElement>();

    delete() {
        this.deleteProxiedPort.emit(this.proxiedPort);
    }
}
