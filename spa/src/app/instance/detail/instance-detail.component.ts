import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailQueryGql,
    GetInstanceDetailQueryInstanceFieldinterface,
    GetInstanceDetailQueryInterface,
} from './get-instance-detail.query';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

const POLLING_INTERVAL = 5000;

@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit, OnDestroy {

    instance: GetInstanceDetailQueryInstanceFieldinterface;

    pollingSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = Observable.interval(POLLING_INTERVAL);
        this.pollingSubscription = polling.subscribe(
            () => { this.getInstance(); },
        );
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.instance.definition.project.id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.instance.definition.id]);
    }

    getServiceById(id) {
        for (const service of this.instance.services) {
            if (id === service.id) {
                return service;
            }
        }
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailQueryInterface>({
                query: getInstanceDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
