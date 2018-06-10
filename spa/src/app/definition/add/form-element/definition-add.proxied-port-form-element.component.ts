import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionAddFormProxiedPortFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-proxied-port-form-element',
    templateUrl: './definition-add.proxied-port-form-element.component.html',
    styles: []
})
export class DefinitionAddProxiedPortFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormProxiedPortFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormProxiedPortFormElement> =
        new EventEmitter<DefinitionAddFormProxiedPortFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
