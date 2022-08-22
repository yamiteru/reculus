import { CACHE, DATA } from "../constants";
import { EventMap, InferType, Noop, Type, Value } from "../types";

export function publish<
	I extends Type,
	O extends Type,
	M extends EventMap<I, O>,
	K extends keyof M
>(
	valueInstance: Value<I, O>,
	eventKey: K,
	nextValue: M[K]
) {
	const _ = valueInstance[DATA];
	const set = _.event[eventKey] as Set<(value: M[K]) => void>;

	if(set && set.size) {
		for(const handler of set.values()) {
			handler(nextValue);
		}
	}
}

export function injectDependency<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>
) {
	const _ = valueInstance[DATA];

	if(CACHE.reactiveUpdateListener) {
		_.event.value ??= new Set();
		_.event.value.add(CACHE.reactiveUpdateListener);

		CACHE.mapDidInjectDependencies = true;
	}
}

export function get<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>
) {
	injectDependency(valueInstance);
	return valueInstance[DATA].value.current as InferType<O>;
}

export function set<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>,
	nextValue: InferType<I>
) {
	const _ = valueInstance[DATA];
	const mappedValue = _.map(nextValue, {
		input: nextValue,
		previous: _.value.previous
	});

	if(mappedValue !== undefined) {
		_.value.current = mappedValue;
		_.value.previous = {
			input: nextValue,
			output: mappedValue
		};

		publish(valueInstance, "value", mappedValue);

		return mappedValue;
	}

	return _.value.current as InferType<O>;
}

export function $<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>,
	newValue?: InferType<I>
) {
	return newValue !== undefined
		? set(valueInstance, newValue)
		: get(valueInstance);
}

export function effect(listener: Noop) {
	CACHE.reactiveUpdateListener = listener;

	listener();

	CACHE.reactiveUpdateListener = null;
}
