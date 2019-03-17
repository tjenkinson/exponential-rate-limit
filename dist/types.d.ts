/**
 * Contains `enqueueTime`, which is the time the job was enqueued.
 */
export interface JobMetadata {
    enqueueTime: number;
}
/**
 * The function which will be executed aynchronously. If it returns `true` or a promise
 * which resolves with `true` (or rejects), then the delays between jobs will start decreasing.
 */
export declare type Job = (jobMetadata: JobMetadata) => Promise<boolean> | boolean | void;
export interface Config {
    /**
     * The maximum time (seconds) between jobs executing.
     */
    maxInterval?: number;
    /**
     * The delay function.
     */
    delayFunction?: DelayFunction;
}
/**
 * A functon that returns the amount of seconds to wait before the next job
 * should be executed. It takes a number `x` which is >= 0. As `x` increases the delay
 * must also increase. The delay must be between `0` and `maxDelay`.
 */
export declare type DelayFunction = (x: number, maxDelay: number) => number;
export interface JobHolder {
    job: Job;
    metadata: JobMetadata;
}
