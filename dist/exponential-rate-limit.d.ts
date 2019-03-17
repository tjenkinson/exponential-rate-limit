import { Config, DelayFunction, Job } from './types';
/**
 * This delay function will allow the first 4 jobs to be executed immediately,
 * and then start increasing the delay exponentially.
 */
export declare const defaultDelayFunction: DelayFunction;
export declare class JobQueue {
    private readonly _x;
    private readonly _maxInterval;
    private readonly _delayFunction;
    private _jobs;
    private _timer;
    /**
     * Construct an instance of `JobQueue`.
     *
     * The following configuration may be provided:
     * - `maxInterval`: The maximum number of seconds to wait between jobs. The time it takes for
     *                  the interval to reach this depends on `delayFunction`. Defaults to 5 seconds.
     * - `delayFunction`: A functon that returns the amount of seconds to wait before the next job
     *                    should be executed. Defaults to `defaultDelayFunction`, which will allow the
     *                    first 4 jobs to execute immediately, and then the delays will increase
     *                    exponentially untill `maxInterval` is reached.
     */
    constructor({ maxInterval, delayFunction }?: Config);
    /**
     * Enqueue a job to be executed asynchonously.
     *
     * This returns an object with a `remove` function, which when called will remove the job
     * from the queue, meaning it will not be executed (if this hasn't already happened).
     *
     * @param job A function which will be executed asychronously. It will receive `JobMetadata`,
     *            which includes the time the job was queued. If it returns `true` or a promise
     *            that resolves with `true`, the delays between jobs will start decreasing.
     */
    enqueue(job: Job): {
        remove: () => void;
    };
    private _executeNext;
    private _calculateDelay;
}
