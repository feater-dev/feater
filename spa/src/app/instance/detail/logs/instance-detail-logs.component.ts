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

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    readonly COLLAPSED = 1;
    readonly EXPANDED = 2;

    instance: GetInstanceDetailLogsQueryInstanceFieldInterface;

    pollingSubscription: Subscription;

    lastCommandLogEntryId: string = null;

    expandToggles: {[commandLogId: string]: number} = {};

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

    trackById(index: number, obj: any): any {
        return obj.id;
    }

    expand(commandLog: {id: string, completedAt?: Date}): void {
        this.expandToggles[commandLog.id] = this.EXPANDED;
    }

    collapse(commandLog: {id: string, completedAt?: Date}): void {
        this.expandToggles[commandLog.id] = this.COLLAPSED;
    }

    isExpanded(commandLog: {id: string, completedAt?: Date}): boolean {
        if (this.EXPANDED === this.expandToggles[commandLog.id]) {
            return true;
        }
        if (this.COLLAPSED === this.expandToggles[commandLog.id]) {
            return false;
        }

        return !commandLog.completedAt;
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
                        if (0 === instanceCommandLog.entries.length) {
                            instanceCommandLog.entries = commandLog.entries;
                        } else {
                            const lastEntry = _.last(instanceCommandLog.entries);
                            instanceCommandLog.entries = instanceCommandLog.entries.concat(
                                _.filter(commandLog.entries, (entry) => entry.id > lastEntry.id)
                            );
                        }
                    }
                }
            });
    }

    private updateLastCommandLogEntryId(
        resultData: GetInstanceDetailLogsQueryInterface | UpdateInstanceDetailLogsQueryInterface,
    ): void {
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
            this.lastCommandLogEntryId = _.max(entryIds);
        }
    }
}
