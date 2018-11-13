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

    readonly POLLING_INTERVAL = 3000; // 5 seconds.

    i = 0;

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
        return commandLogEntries.map(entry => `${entry.id} --- ${entry.message}`).join('\n');
    }

    trackById(index: number, obj: any): any {
        return obj.id;
    }

    expand(commandLogId: string): void {
        this.expandedCommandLogIds[commandLogId] = true;
    }

    collapse(commandLogId: string): void {
        this.expandedCommandLogIds[commandLogId] = false;
    }

    isExpanded(commandLogId: string): boolean {
        return true;
//        return this.expandedCommandLogIds[commandLogId];
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
                this.updateLastCommandLogEntryId(resultData);
                console.log('get done');
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
                        instanceCommandLog.completedAt = commandLog.completedAt;
                        instanceCommandLog.failedAt = commandLog.failedAt;
                        // if (0 !== commandLog.entries.length) {
                            instanceCommandLog.entries = instanceCommandLog.entries.concat(
                                [{id: 'dummy', message: `${this.i}`}],
                                commandLog.entries,
                            );
                        // }
                    }
                }
                this.i += 1;
                console.log('update done');
            });
    }

    private updateLastCommandLogEntryId(
        resultData: GetInstanceDetailLogsQueryInterface | UpdateInstanceDetailLogsQueryInterface,
    ): void {
        console.log(this.i);
        console.log('lastCommandLogEntryId was', this.lastCommandLogEntryId);
        const entryIds = _.map(
            _.flatten(
                resultData.instance.commandLogs.map((commandLog) => {
                    return commandLog.entries.length > 0
                        ? commandLog.entries.slice(-1)
                        : [];
                })
            ),
            'id'
        );
        if (0 !== entryIds.length) {
            this.lastCommandLogEntryId = _.maxBy(entryIds, id => parseInt(id, 16));
        }
        console.log('lastCommandLogEntryId is', this.lastCommandLogEntryId);
    }
}
