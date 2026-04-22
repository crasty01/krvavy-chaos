import * as v from 'valibot';
import { json } from '@sveltejs/kit';

export const parseBody = async <TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	request: Request,
	schema: TSchema,
): Promise<{ data: v.InferOutput<TSchema>; error?: never } | { data?: never; error: Response }> => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return { error: json({ error: 'Neplatný JSON' }, { status: 400 }) };
	}

	const result = v.safeParse(schema, raw);
	if (!result.success) {
		return {
			error: json(
				{ error: 'Neplatná data', issues: v.flatten<TSchema>(result.issues).nested },
				{ status: 400 },
			),
		};
	}

	return { data: result.output as v.InferOutput<TSchema> };
};
