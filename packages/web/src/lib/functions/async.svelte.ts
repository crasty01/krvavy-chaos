export type AsyncActionStatus = 'idle' | 'loading' | 'success' | 'error';

export type AsyncActionOptions = {
	minLoading?: number;
	minSuccess?: number;
	minError?: number;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const createAsyncAction = (opts?: AsyncActionOptions) => {
	const { minLoading = 200, minSuccess = 1500, minError = 2000 } = opts ?? {};

	let status = $state<AsyncActionStatus>('idle');
	let ticket = 0;

	const trigger = async (fn: () => Promise<void>) => {
		const myTicket = ++ticket;
		status = 'loading';
		const start = Date.now();

		let ok = false;
		try {
			await fn();
			ok = true;
		} catch {}

		await sleep(Math.max(0, minLoading - (Date.now() - start)));
		if (ticket !== myTicket) return;

		status = ok ? 'success' : 'error';

		await sleep(ok ? minSuccess : minError);
		if (ticket !== myTicket) return;

		status = 'idle';
	};

	return {
		get status() { return status; },
		trigger,
	};
};

export type AsyncAction = ReturnType<typeof createAsyncAction>;
