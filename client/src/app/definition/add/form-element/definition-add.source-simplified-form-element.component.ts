import { Component, Input } from '@angular/core';
import { SourceFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-source-simplified-form-element',
    templateUrl:
        './definition-add.source-simplified-form-element.component.html',
    styles: [],
})
export class DefinitionAddSourceSimplifiedFormElementComponent {
    @Input() source: SourceFormElement;
}
