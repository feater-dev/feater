import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    getInstanceLogsQueryGql,
    GetInstanceLogsQueryInstanceFieldInterface,
    GetInstanceLogsQueryInterface,
} from './get-instance-logs.query';
import { InstanceTabs } from '../tabs/instance-tabs.component';
import gql from 'graphql-tag';
import { ToastrService } from 'ngx-toastr';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { interval, Subscription } from 'rxjs';

interface ModificationAction {
    id: string;
    name: string;
    type: string;
}

@Component({
    selector: 'app-instance-logs',
    templateUrl: './instance-logs.component.html',
    styles: [],
})
export class InstanceLogsComponent implements OnInit {
    instance: GetInstanceLogsQueryInstanceFieldInterface;

    modificationActions: ModificationAction[] = [];

    expandActionLogToggles: { [actionLogId: string]: number } = {};

    expandCommandLogToggles: { [commandLogId: string]: number } = {};

    readonly instanceTabs = InstanceTabs;

    protected readonly pollingInterval = 5000; // 5 seconds.

    protected pollingSubscription: Subscription;

    readonly COLLAPSED = 1;
    readonly EXPANDED = 2;

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = interval(this.pollingInterval);
        this.pollingSubscription = polling.subscribe(() => {
            this.getInstance(false);
        });
    }

    joinMessages(commandLogEntries) {
        return commandLogEntries
            .map(commandLogEntry => {
                return commandLogEntry.message;
            })
            .join('\n');
    }

    trackById(index: number, obj: any): any {
        return obj.id;
    }

    expandActionLog(actionLog: { id: string }): void {
        this.expandActionLogToggles[actionLog.id] = this.EXPANDED;
    }

    collapseActionLog(actionLog: { id: string }): void {
        this.expandActionLogToggles[actionLog.id] = this.COLLAPSED;
    }

    isActionLogExpanded(actionLog: {
        id: string;
        completedAt?: string;
    }): boolean {
        if (this.EXPANDED === this.expandActionLogToggles[actionLog.id]) {
            return true;
        }
        if (this.COLLAPSED === this.expandActionLogToggles[actionLog.id]) {
            return false;
        }

        return !actionLog.completedAt;
    }

    expandCommandLog(commandLog: { id: string }): void {
        this.expandCommandLogToggles[commandLog.id] = this.EXPANDED;
    }

    collapseCommandLog(commandLog: { id: string }): void {
        this.expandCommandLogToggles[commandLog.id] = this.COLLAPSED;
    }

    isCommandLogExpanded(commandLog: {
        id: string;
        completedAt?: string;
    }): boolean {
        if (this.EXPANDED === this.expandCommandLogToggles[commandLog.id]) {
            return true;
        }
        if (this.COLLAPSED === this.expandCommandLogToggles[commandLog.id]) {
            return false;
        }

        return !commandLog.completedAt;
    }

    modifyInstance(modificationActionId): void {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`
                    ${this.getModifyInstanceMutation(modificationActionId)}
                `,
            })
            .subscribe(
                ({ data }) => {
                    this.spinner.hide();
                    this.toastr.success(
                        `Modification of instance <em>${data.instance.name}</em> started.`,
                    );

                    this.spinner.hide();
                },
                () => {
                    this.toastr.error(
                        `Failed to modify instance <em>${this.instance.name}</em>.`,
                    );
                    this.spinner.hide();
                },
            );
    }

    protected getInstance(spinner = true) {
        if (spinner) {
            this.spinner.show();
        }
        this.apollo
            .watchQuery<GetInstanceLogsQueryInterface>({
                query: getInstanceLogsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetInstanceLogsQueryInterface = result.data;
                this.instance = {
                    id: resultData.instance.id,
                    name: resultData.instance.name,
                    actionLogs: [],
                    definition: resultData.instance.definition,
                };
                for (const actionLogData of resultData.instance.actionLogs) {
                    this.addActionLog(actionLogData);
                }

                this.modificationActions = this.instance.definition.actions.filter(
                    action => 'modification' === action.type,
                );

                if (spinner) {
                    this.spinner.hide();
                }
            });
    }

    protected addActionLog(actionLogData) {
        const actionLog = {
            id: actionLogData.id,
            actionId: actionLogData.actionId,
            actionType: actionLogData.actionType,
            actionName: actionLogData.actionName,
            createdAt: actionLogData.createdAt,
            completedAt: actionLogData.completedAt,
            failedAt: actionLogData.failedAt,
            commandLogs: [],
        };
        this.instance.actionLogs.push(actionLog);
        for (const commandLogData of actionLogData.commandLogs) {
            this.addCommandLog(actionLog, commandLogData);
        }
    }

    protected addCommandLog(actionLog, commandLogData) {
        const commandLog = {
            id: commandLogData.id,
            description: commandLogData.description,
            createdAt: commandLogData.createdAt,
            completedAt: commandLogData.completedAt,
            failedAt: commandLogData.failedAt,
            entries: [],
        };
        actionLog.commandLogs.push(commandLog);
        this.addCommandLogEntries(commandLog, commandLogData.entries);
    }

    protected addCommandLogEntries(commandLog, commandLogEntriesData) {
        const commandLogEntries = _.cloneDeep(commandLogEntriesData);
        commandLog.entries = commandLogEntries;
    }

    protected getModifyInstanceMutation(modificationActionId: string): string {
        const jsonQuery = {
            mutation: {
                modifyInstance: {
                    __args: {
                        instanceId: this.instance.id,
                        modificationActionId,
                    },
                    id: true,
                    name: true,
                },
            },
        };

        return jsonToGraphQLQuery(jsonQuery);
    }
}
