export interface LogInterface {
    readonly timestamp: Date;
    readonly message: string;
}

export interface JobLogInterface extends LogInterface {
    readonly job: string;
}

export interface BuildJobLogInterface extends JobLogInterface {
    readonly build: {
        readonly id: string;
        readonly hash: string;
    };
}

export interface SourceJobLogInterface extends BuildJobLogInterface {
    readonly source: {
        readonly id: string;
        readonly hash: string;
    };
}
