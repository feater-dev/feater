import {Component, Input} from '@angular/core';
import {GetDefinitionListQueryDefinitionsFieldItemInterface} from '../list/get-definition-list.query';


@Component({
    selector: 'app-definition-table',
    templateUrl: './definition-table.component.html',
    styles: []
})
export class DefinitionTableComponent {

    @Input() definitions: GetDefinitionListQueryDefinitionsFieldItemInterface[];

    @Input() withProjects = true;

    search: string;

    getFilterCondition() {
        return {
            $or: [
                {name: this.search},
                {project: {name: this.search}},
            ],
        };
    }

}
