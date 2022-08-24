import { CACHE, DATA } from "../constants";
import { EventHandler, EventMap, InferType, Noop, Type, Value } from "../types";

export function publish<
	I extends Type,
	O extends Type,
	K extends keyof EventMap<any, any>
>(
	valueInstance: Value<I, O>,
	event: K,
	nextValue: EventMap<I, O>[K]
) {
	if(valueInstance[DATA]) {
		const _ = valueInstance[DATA];
		const set = _.event[event] as Set<
			EventHandler<I, O, K>
		>;

		if(set && set.size) {
			for(const handler of set.values()) {
				handler(nextValue);
			}
		}
	}
}

export function subscribe<
	I extends Type,
	O extends Type,
	K extends keyof EventMap<any, any>
>(
	valueInstance: Value<I, O>,
	event: K,
	handler: EventHandler<I, O, K>
) {
	if(valueInstance[DATA]) {
		const ctx = valueInstance[DATA].event;

		if(event in ctx) {
			ctx[event] ??= new Set() as any;
			(ctx[event] as Set<EventHandler<I, O, K>>).add(handler);
		}
	}

	return () => {
		if(valueInstance[DATA]) {
			valueInstance[DATA].event[event]?.delete(handler);
		}
	};
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
	if(!valueInstance[DATA]) {
		return undefined;
	}

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
	if(!valueInstance[DATA]) {
		return undefined;
	}

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

export function dispose<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>
) {
	if (valueInstance[DATA]) {
		publish(valueInstance, "dispose", undefined);

		valueInstance[DATA] = false as any;
	}
}

export function effect(listener: Noop) {
	CACHE.reactiveUpdateListener = listener;

	listener();

	CACHE.reactiveUpdateListener = null;
}
