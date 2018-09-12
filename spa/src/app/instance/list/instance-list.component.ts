import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    getInstanceListQueryGql,
    GetInstanceListQueryInstanceFieldItemInterface,
    GetInstanceListQueryInterface,
} from './get-instance-list.query';

@Component({
    selector: 'app-instance-list',
    templateUrl: './instance-list.component.html',
    styles: []
})
export class InstanceListComponent implements OnInit {

    instances: GetInstanceListQueryInstanceFieldItemInterface[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstances();
    }

    goToDetail(instance) {
        this.router.navigate(['/instance', instance.id]);
    }

    private getInstances() {
        this.apollo
            .watchQuery<GetInstanceListQueryInterface>({
                query: getInstanceListQueryGql,
                variables: {
                    definitionId: this.route.snapshot.queryParams['definitionId'],
                    limit: this.route.snapshot.queryParams['limit'],
                    offset: this.route.snapshot.queryParams['offset'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceListQueryInterface = result.data;
                this.instances = resultData.instances;
            });
    }
}
