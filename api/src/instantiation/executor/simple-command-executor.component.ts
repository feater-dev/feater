import {SimpleCommand} from './simple-command';
import {CompositeSimpleCommandExecutorComponent} from './composite-simple-command-executor.component';
import {Injectable} from '@nestjs/common';

@Injectable()
export class SimpleCommandExecutorComponent {
    constructor(
        private readonly compositeSimpleCommandExecutorComponent: CompositeSimpleCommandExecutorComponent,
    ) {}

    execute(command: SimpleCommand): Promise<any> {
        console.log(`SimpleCommandExecutorComponent::execute(${command.constructor.name}) -- started`);
        const result = this.compositeSimpleCommandExecutorComponent.execute(command);
        result.then(
            () => {
                console.log(`SimpleCommandExecutorComponent::execute(${command.constructor.name}) -- done`);
            },
        );

        return result;
    }
}
