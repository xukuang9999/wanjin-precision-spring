export const scheduleIdleTask = (callback: () => void, timeout: number = 1200): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const requestIdle = window.requestIdleCallback;
  const cancelIdle = window.cancelIdleCallback;

  if (typeof requestIdle === 'function') {
    const idleId = requestIdle(() => callback(), { timeout });
    return () => {
      if (typeof cancelIdle === 'function') {
        cancelIdle(idleId);
      }
    };
  }

  const timeoutId = window.setTimeout(callback, Math.min(timeout, 800));
  return () => window.clearTimeout(timeoutId);
};
