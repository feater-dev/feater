import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
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

    items: Observable<GetInstanceListQueryInstanceFieldItemInterface[]>;

    constructor(
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/instance', item.id]);
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<GetInstanceListQueryInterface>({
                query: getInstanceListQueryGql
            })
            .valueChanges
            .pipe(
                map(result => result.data.instances)
            );
    }
}
