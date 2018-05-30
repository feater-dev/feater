import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {BuildDefinitionAddFormProxiedPortFormElement} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-proxied-port-form-element',
    templateUrl: './build-definition-add.proxied-port-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddProxiedPortFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormProxiedPortFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormProxiedPortFormElement> =
        new EventEmitter<BuildDefinitionAddFormProxiedPortFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
