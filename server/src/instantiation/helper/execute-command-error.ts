export class ExecuteCommandError extends Error {
    constructor(
        public exitCode: number,
        message: string = 'Command execution failed.',
    ) {
        super(message);
    }
}
