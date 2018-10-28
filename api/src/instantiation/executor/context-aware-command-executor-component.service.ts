import {ContextAwareCommand} from './context-aware-command.interface';
import {SimpleCommandExecutorComponent} from './simple-command-executor.component';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ContextAwareCommandExecutorComponent {
    constructor(
        private readonly simpleCommandExecutorComponent: SimpleCommandExecutorComponent,
    ) {}

    async execute(command: ContextAwareCommand, context: any): Promise<void> {
        const wrappedCommand = command.wrapCommand(context);

        console.log(`ContextAwareCommandExecutorComponent::execute(${wrappedCommand.constructor.name})`);

        const result = await this.simpleCommandExecutorComponent.execute(wrappedCommand);
        if (command.processResult) {
            command.processResult(result, context);
        }
    }
}
