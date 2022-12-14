import {InferType, Type, Value, Map, defaultMap, set, Check} from "../";
import {CACHE, DATA, ERROR_PREFIX} from "../constants";

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
			// TODO: add custom map with validation
			map
		}
	};
}

export function value<
	O extends Type
>(
	type: Check<O>
) {
	return <
		I extends Type = O,
	>(
		initialValue: InferType<I>,
		map: Map<I, O> = defaultMap
	): Value<I, O> => {
		type(initialValue);

		const valueInstance = createValueInstance<I, O>(
			initialValue,
			map
		);

		CACHE.reactiveUpdateListener = () => {
			set(valueInstance, undefined as any);
		};

		try {
			const {
				map,
				value
			} = valueInstance[DATA];

			const mappedValue = map(undefined as any, {
				input: undefined,
				previous: value.previous
			});

			if(CACHE.mapDidInjectDependencies && mappedValue !== undefined) {
				value.current = mappedValue;
			}
		} catch(e: any) {
			const message = e.message;

			if(message && message.indexOf(ERROR_PREFIX) === 0) {
				throw Error(message);
			}
		}

		CACHE.reactiveUpdateListener = null;
		CACHE.mapDidInjectDependencies = false;

		return valueInstance;
	};
}
