export const useDelayedBoolean = (initial = false, delay = 200) => {
  let value = $state(initial);
  let timeout: ReturnType<typeof setTimeout> | null = null;
	let lastSetTrueTime: number | null = null;

  return {
    get current() {
      return value;
    },
    set current(newValue) {
      if (timeout) clearTimeout(timeout);
			const timeSinceTrue = lastSetTrueTime ? Date.now() - lastSetTrueTime : null;

      if (newValue === true) {
        value = true;
				lastSetTrueTime = Date.now();
      } else if (timeSinceTrue !== null && timeSinceTrue < delay) {
				timeout = setTimeout(() => {
					value = false;
					timeout = null;
				}, delay - timeSinceTrue);
			} else {
				value = false;
      }
    }
  };
}