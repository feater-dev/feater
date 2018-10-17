import {CommandInterface} from './command.interface';

export class ComplexCommand implements CommandInterface {
    constructor(
        readonly children: CommandInterface[],
        readonly allowParallel = true,
    ) {
        this.children = children;
        this.allowParallel = allowParallel;
    }

    isParallelAllowed(): boolean {
        return this.allowParallel;
    }

    addChild(child: CommandInterface) {
        this.children.push(child);
    }
}
