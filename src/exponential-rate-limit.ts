import { DecayingValue } from './decaying-value';
import { deferException } from './defer-exception';
import { Config, DelayFunction, Job, JobHolder } from './types';

/**
 * This delay function will allow the first 4 jobs to be executed immediately,
 * and then start increasing the delay exponentially.
 */
export const defaultDelayFunction: DelayFunction = (x: number/*, maxDelay: number */) => {
  x -= 4;
  if (x < 0) {
    return 0;
  }
  return Math.pow(1.1, x) - 1;
};

export class JobQueue {
  private readonly _x: DecayingValue;
  private readonly _maxInterval: number;
  private readonly _delayFunction: DelayFunction;
  private _jobs: JobHolder[] = [];
  private _timer: NodeJS.Timeout | number | null = null;

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
  constructor({ maxInterval = 5, delayFunction = defaultDelayFunction }: Config = {}) {
    this._maxInterval = maxInterval;
    this._delayFunction = delayFunction;
    this._x = new DecayingValue(0, 1 / maxInterval);
  }

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
  public enqueue(job: Job): { remove: () => void } {
    const jobHolder = { job, metadata: { enqueueTime: Date.now() } };
    this._jobs.push(jobHolder);
    this._executeNext();
    return {
      remove: () => {
        const index = this._jobs.indexOf(jobHolder);
        if (index >= 0) {
          this._jobs.splice(index, 1);
          if (this._timer && !this._jobs.length) {
            (clearTimeout as any)(this._timer);
            this._timer = null;
          }
        }
      },
    };
  }

  private _executeNext(): void {
    if (this._timer) {
      return;
    }

    const jobHolder = this._jobs.shift();
    if (jobHolder) {
      this._x.increment();
      const delay = this._calculateDelay();
      // support browser and node
      this._timer = (setTimeout as any)(() => {
        this._timer = null;
        this._executeNext();
      }, delay * 1000);

      deferException(() => {
        const res = jobHolder.job(jobHolder.metadata);
        if (res === true) {
          this._x.increment(-2);
        } else if (res && typeof res.then === 'function') {
          res.then((a) => a && this._x.increment(-2));
        }
      });
    }
  }

  private _calculateDelay(): number {
    const maxDelay = this._maxInterval;
    return Math.min(maxDelay, this._delayFunction(this._x.get(), maxDelay));
  }
}
