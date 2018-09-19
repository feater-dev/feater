import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/observable/interval';
import {Apollo} from 'apollo-angular';
import {
    GetDefinitionDetailQueryDefinitionFieldInterface,
    getDefinitionDetailQueryGql,
    GetDefinitionDetailQueryInterface
} from './get-definition-detail.query';


@Component({
    selector: 'app-definition-detail',
    templateUrl: './definition-detail.component.html',
    styles: []
})
export class DefinitionDetailComponent implements OnInit {

    definition: GetDefinitionDetailQueryDefinitionFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getDefinitions();
    }

    goToList() {
        this.router.navigate(['/definitions']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.definition.project.id]);
    }

    goToInstanceDetail(id: string) {
        this.router.navigate(['/instance', id]);
    }

    goToInstanceAdd() {
        this.router.navigate(['/definition', this.definition.id, 'instance', 'add']);
    }

    private getDefinitions() {
        this.apollo
            .watchQuery<GetDefinitionDetailQueryInterface>({
                query: getDefinitionDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionDetailQueryInterface = result.data;
                this.definition = resultData.definition;
            });
    }
}
