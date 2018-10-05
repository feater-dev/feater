import {Component, Input} from '@angular/core';
import {GetProjectListQueryProjectsFieldItemInterface} from '../list/get-project-list.query';


@Component({
    selector: 'app-project-table',
    templateUrl: './project-table.component.html',
    styles: []
})
export class ProjectTableComponent {

    @Input() projects: GetProjectListQueryProjectsFieldItemInterface[];

}
