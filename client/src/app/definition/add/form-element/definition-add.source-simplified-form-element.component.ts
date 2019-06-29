import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {
    DefinitionSourceFormElement,
    BeforeBuildTaskFormElement,
    TaskFormElement,
    InterpolateTaskFormElement,
} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-source-simplified-form-element',
    templateUrl: './definition-add.source-simplified-form-element.component.html',
    styles: []
})
export class DefinitionAddSourceSimplifiedFormElementComponent implements OnInit {

    @Input() source: DefinitionSourceFormElement;

    ngOnInit() {}
}
