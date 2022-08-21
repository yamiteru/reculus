import {InferType, Type, Assert, Value, Map, defaultMap} from "../";
import {DATA} from "../constants";

export function createValueInstance<
	I extends Type,
	O extends Type
>(
	initialValue: O,
	map: Map<I, O>
): Value<I, O> {
	return {
		[DATA]: {
			id: Symbol(),
			alive: true,
			value: {
				draft: undefined,
				current: initialValue,
				previous: {
					input: undefined,
					output: undefined
				}
			},
			event: {
				value: null,
				stash: null,
				drop: null,
				commit: null,
				dispose: null
			},
			map
		}
	};
}

export function value<
	O extends Type
>(
	assert: Assert<O>
) {
	return <
		I extends Type = O,
	>(
		initialValue: InferType<I>,
		map: Map<I, O> = defaultMap
	): Value<I, O> => {
		assert(initialValue);

		return createValueInstance<I, O>(
			initialValue,
			map
		);
	};
}
