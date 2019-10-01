import _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription, interval } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    getInstanceLogsQueryGql,
    GetInstanceLogsQueryInstanceFieldInterface,
    GetInstanceLogsQueryInterface,
} from './get-instance-logs.query';
import {
    updateInstanceLogsQueryGql,
    UpdateInstanceLogsQueryInterface,
} from './update-instance-logs.query';
import { InstanceTabs } from '../tabs/instance-tabs.component';

@Component({
    selector: 'app-instance-logs',
    templateUrl: './instance-logs.component.html',
    styles: [],
})
export class InstanceLogsComponent implements OnInit, OnDestroy {
    readonly instanceTabs = InstanceTabs;

    instance: GetInstanceLogsQueryInstanceFieldInterface;

    protected readonly pollingInterval = 5000; // 5 seconds.

    protected pollingSubscription: Subscription;

    protected readonly dateFormat = 'YYYY-MM-DD HH:mm:ss';

    protected readonly commandLogCollapsed = 1;
    protected readonly commandLogExpanded = 2;

    lastCommandLogEntryId: string = null;

    expandToggles: { [commandLogId: string]: number } = {};

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getInstance();
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    joinMessages(commandLogEntries) {
        const messages = _.map(commandLogEntries, 'message');
        const formattedTimestamps = _.map(
            commandLogEntries,
            'formattedTimestamp',
        );

        return _.zip(formattedTimestamps, messages)
            .map(([formattedTimestamp, message]) => {
                const messageLines = message.split(/\r?\n/g);
                const joinedMessages = [];
                joinedMessages.push(
                    `${formattedTimestamp} | ${messageLines[0]}`,
                );
                for (const messageLine of messageLines.slice(1)) {
                    joinedMessages.push(
                        `${_.repeat(
                            ' ',
                            formattedTimestamp.length,
                        )} | ${messageLine}`,
                    );
                }

                return joinedMessages.join('\n');
            })
            .join('\n');
    }

    trackById(index: number, obj: any): any {
        return obj.id;
    }

    expand(commandLog: { id: string }): void {
        this.expandToggles[commandLog.id] = this.commandLogExpanded;
    }

    collapse(commandLog: { id: string }): void {
        this.expandToggles[commandLog.id] = this.commandLogCollapsed;
    }

    isExpanded(commandLog: { id: string; completedAt?: string }): boolean {
        if (this.commandLogExpanded === this.expandToggles[commandLog.id]) {
            return true;
        }
        if (this.commandLogCollapsed === this.expandToggles[commandLog.id]) {
            return false;
        }

        return !commandLog.completedAt;
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    protected getInstance() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetInstanceLogsQueryInterface>({
                query: getInstanceLogsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetInstanceLogsQueryInterface = result.data;
                this.updateLastCommandLogEntryId(resultData);
                this.instance = {
                    id: resultData.instance.id,
                    name: resultData.instance.name,
                    commandLogs: [],
                };
                for (const commandLogData of resultData.instance.commandLogs) {
                    this.addCommandLog(commandLogData);
                }

                if (!this.pollingSubscription) {
                    this.pollingSubscription = interval(
                        this.pollingInterval,
                    ).subscribe(() => {
                        this.updateInstance();
                    });
                }

                this.spinner.hide();
            });
    }

    protected updateInstance() {
        this.apollo
            .watchQuery<UpdateInstanceLogsQueryInterface>({
                query: updateInstanceLogsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                    lastCommandLogEntryId: this.lastCommandLogEntryId,
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: UpdateInstanceLogsQueryInterface =
                    result.data;
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
        resultData:
            | GetInstanceLogsQueryInterface
            | UpdateInstanceLogsQueryInterface,
    ): void {
        const entryIds = _.map(
            _.flatten(
                resultData.instance.commandLogs.map(commandLog => {
                    return commandLog.entries.length > 0
                        ? commandLog.entries.slice(-1)
                        : [];
                }),
            ),
            'id',
        );
        if (0 !== entryIds.length) {
            this.lastCommandLogEntryId = _.max(entryIds);
        }
    }

    protected findCommandLog(commandLogId) {
        return _.find(this.instance.commandLogs, { id: commandLogId });
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
            commandLogEntry.formattedTimestamp = this.formatTimestamp(
                commandLogEntry.timestamp,
            );
        }
        if (0 === commandLog.entries.length) {
            commandLog.entries = commandLogEntries;

            return;
        }

        const lastCommandLogEntryId = _.last(commandLog.entries).id;
        commandLog.entries = commandLog.entries.concat(
            commandLogEntries.filter(
                commandLogEntry => commandLogEntry.id > lastCommandLogEntryId,
            ),
        );
    }

    protected formatTimestamp(timestamp: string): string {
        return moment(timestamp).format(this.dateFormat);
    }
}
