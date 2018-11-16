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
import * as moment from 'moment';

@Component({
    selector: 'app-instance-detail-logs',
    templateUrl: './instance-detail-logs.component.html',
    styles: []
})
export class InstanceDetailLogsComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.
    readonly TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    readonly COLLAPSED = 1;
    readonly EXPANDED = 2;

    instance: GetInstanceDetailLogsQueryInstanceFieldInterface;

    pollingSubscription: Subscription;

    lastCommandLogEntryId: string = null;

    expandToggles: {[commandLogId: string]: number} = {};

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
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

    joinMessages(commandLogEntries) {
        const messages = _.map(commandLogEntries, 'message');
        const formattedTimestamps = _.map(commandLogEntries, 'formattedTimestamp');

        return _.zip(formattedTimestamps, messages)
            .map(([formattedTimestamp, message]) => {
                const messageLines = message.split(/\r?\n/g);
                const joinedMessages = [];
                joinedMessages.push(`${formattedTimestamp} | ${messageLines[0]}`);
                for (const messageLine of messageLines.slice(1)) {
                    joinedMessages.push(`${_.repeat(' ', formattedTimestamp.length)} | ${messageLine}`);
                }

                return joinedMessages.join('\n');
            })
            .join('\n');
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

    protected getInstance() {
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
                this.updateLastCommandLogEntryId(resultData);
                this.instance = {
                    id: resultData.instance.id,
                    name: resultData.instance.name,
                    commandLogs: [],
                };
                for (const commandLogData of resultData.instance.commandLogs) {
                    this.addCommandLog(commandLogData);
                }
            });
    }

    protected updateInstance() {
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
                for (const commandLogData of resultData.instance.commandLogs) {
                    const commandLog = this.findCommandLog(commandLogData.id);
                    if (!commandLog) {
                        this.addCommandLog(commandLogData);
                    } else {
                        this.updateCommandLog(commandLog, commandLogData);
                    }
                }
            });
    }

    protected updateLastCommandLogEntryId(
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

    protected findCommandLog(commandLogId) {
        return _.find(this.instance.commandLogs, {id: commandLogId});
    }

    protected addCommandLog(commandLogData) {
        const commandLog = {
            id: commandLogData.id,
            description: commandLogData.description,
            createdAt: commandLogData.createdAt,
            completedAt: commandLogData.completedAt,
            failedAt: commandLogData.failedAt,
            entries: [],
        };
        this.instance.commandLogs.push(commandLog);
        this.addCommandLogEntries(commandLog, commandLogData.entries);
    }

    protected updateCommandLog(commandLog, commandLogData) {
        commandLog.createdAt = commandLogData.createdAt;
        commandLog.completedAt = commandLogData.completedAt;
        commandLog.failedAt = commandLogData.failedAt;
        this.addCommandLogEntries(commandLog, commandLogData.entries);
    }

    protected addCommandLogEntries(commandLog, commandLogEntriesData) {
        const commandLogEntries = _.cloneDeep(commandLogEntriesData);
        for (const commandLogEntry of commandLogEntries) {
            commandLogEntry.formattedTimestamp = this.formatTimestamp(commandLogEntry.timestamp);
        }
        if (0 === commandLog.entries.length) {
            commandLog.entries = commandLogEntries;

            return;
        }

        const lastCommandLogEntryId = _.last(commandLog.entries).id;
        commandLog.entries = commandLog.entries.concat(
            commandLogEntries.filter(commandLogEntry => commandLogEntry.id > lastCommandLogEntryId),
        );
    }

    protected formatTimestamp(timestamp: string): string {
        return moment(timestamp).format(this.TIMESTAMP_FORMAT);
    }

}
