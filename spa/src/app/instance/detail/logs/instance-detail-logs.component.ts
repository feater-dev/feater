import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailLogsQueryGql,
    GetInstanceDetailLogsQueryInstanceFieldInterface,
    GetInstanceDetailLogsQueryInterface,
} from './get-instance-detail-logs.query';
import {
    updateInstanceDetailLogsQueryGql,
    UpdateInstanceDetailLogsQueryInstanceFieldInterface,
    UpdateInstanceDetailLogsQueryInterface,
} from './update-instance-detail-logs.query';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
    selector: 'app-instance-detail-logs',
    templateUrl: './instance-detail-logs.component.html',
    styles: []
})
export class InstanceDetailLogsComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    instance: GetInstanceDetailLogsQueryInstanceFieldInterface;

    pollingSubscription: Subscription;

    lastCommandLogEntryId: string = null;

    expandedCommandLogIds: {[id: string]: boolean} = {};

    constructor(
        private route: ActivatedRoute,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = Observable.interval(this.POLLING_INTERVAL);
        this.pollingSubscription = polling.subscribe(
            () => { this.updateInstance(); },
        );
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    joinRecentCommandLogEntryMessages(commandLogEntries) {
        return _.map(commandLogEntries, 'message').join('\n');
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    expand(commandLogId: string): void {
        this.expandedCommandLogIds[commandLogId] = true;
    }

    collapse(commandLogId: string): void {
        this.expandedCommandLogIds[commandLogId] = false;
    }

    isExpanded(commandLogId: string): boolean {
        return this.expandedCommandLogIds[commandLogId];
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailLogsQueryInterface>({
                query: getInstanceDetailLogsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailLogsQueryInterface = result.data;
                this.instance = _.cloneDeep(resultData.instance);
                for (const commandLog of this.instance.commandLogs) {
                    if (commandLog.completedAt) {
                        this.collapse(commandLog.id);
                    } else {
                        this.expand(commandLog.id);
                    }
                }
                this.updateLastCommandLogEntryId(resultData);
            });
    }

    private updateInstance() {
        this.apollo
            .watchQuery<UpdateInstanceDetailLogsQueryInterface>({
                query: updateInstanceDetailLogsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                    lastCommandLogEntryId: this.lastCommandLogEntryId,
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: UpdateInstanceDetailLogsQueryInterface = result.data;
                this.updateLastCommandLogEntryId(resultData);
                for (const commandLog of resultData.instance.commandLogs) {
                    const instanceCommandLog = _.find(this.instance.commandLogs, {id: commandLog.id});
                    if (!instanceCommandLog) {
                        this.instance.commandLogs.push(_.cloneDeep(commandLog));
                    } else {
                        if (commandLog.completedAt && !instanceCommandLog.completedAt) {
                            this.collapse(commandLog.id);
                        }
                        instanceCommandLog.completedAt = commandLog.completedAt;
                        instanceCommandLog.failedAt = commandLog.failedAt;
                        if (0 !== commandLog.entries.length) {
                            instanceCommandLog.entries = instanceCommandLog.entries.concat(commandLog.entries);
                        }
                    }
                }
            });
    }

    private updateLastCommandLogEntryId(
        resultData: GetInstanceDetailLogsQueryInterface | UpdateInstanceDetailLogsQueryInterface,
    ): void {
        const newEntryIds = _.map(
            _.flatten(
                _.map(resultData.instance.commandLogs, 'entries'),
            ),
            'id'
        );
        if (0 !== newEntryIds.length) {
            this.lastCommandLogEntryId = _.max(newEntryIds);
        }
    }
}
