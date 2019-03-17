[![npm version](https://badge.fury.io/js/exponential-rate-limit.svg)](https://badge.fury.io/js/exponential-rate-limit)
# Exponential Rate Limit
A small library which handles decaying exponential backoff. This is useful if you want to start throttling something whilst it is going wrong, but recover once things start working again.

## Demo
The demo source is in "[demo.ts](/src/demo.ts)".

To run the demo locally run `npm run start`.

It is also hosted [here](https://exponential-rate-limit.netlify.com/demo.html) (thanks to [Netify](https://www.netlify.com/)).

## Usage
```ts
import { JobQueue, defaultDelayFunction } from './exponential-rate-limit';

const queue = new JobQueue({
  /**
   * The maximum time (seconds) between jobs executing.
   */
  maxInterval: 5
  /**
   * The delay function.
   */
  delayFunction: defaultDelayFunction
});

const { remove } = queue.enqueue(({ enqueueTime } => {
  console.log('Executing', enqueueTime);
});
```

## Example
The following example implements `throttledFetch`, which will start delaying future executions exponentially (up to the default 5 seconds) every time a request fails or does not respond with status 200.

Every time there is a 200 response, the delays will also start getting shorter again. As time passes without any jobs being executed, the delay the next job would incur also decreases.

```ts
import { JobQueue } from './exponential-rate-limit';

const jobQueue = new JobQueue(); // default options

function throttledFetch(...fetchArgs): Promise<Response> {
  return new Promise((resolve) => {
    jobQueue.enqueue(() => {
      const fetchPromise = fetch(...fetchArgs);
      resolve(fetchPromise);
      return fetchPromise.then((response) => response.status === 200);
    });
  });
}
```

## Browser
This can also be used in the browser thanks to [jsDelivr](https://github.com/jsdelivr/jsdelivr):
```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/exponential-rate-limit@1"></script>
  <script type="text/javascript">
    var queue = new ExponentialRateLimit.JobQueue();
  </script>
</head>
```
