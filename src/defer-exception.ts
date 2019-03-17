export function deferException(fn: () => void): void {
  try {
    fn();
  } catch (e) {
    window.setTimeout(() => {
      throw e;
    }, 0);
  }
}
