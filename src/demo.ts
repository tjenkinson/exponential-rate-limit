import { JobQueue } from './exponential-rate-limit';

const btn = document.getElementById('fire-btn')! as HTMLButtonElement;
const output = document.getElementById('output')! as HTMLDivElement;
const successCheckbox = document.getElementById('success-checkbox')! as HTMLInputElement;

const queue = new JobQueue();

btn.addEventListener('click', () => {
  queue.enqueue(({ enqueueTime }) => {
    // tslint:disable-next-line:no-console
    console.log(`Executing. Delayed by ${Date.now() - enqueueTime}ms.`);
    output.textContent += '🔥';
    return successCheckbox.checked;
  });
});
