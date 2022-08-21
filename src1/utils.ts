import { DATA, ERROR_PREFIX } from "./constants";
import {
	Brand,
	Behavior,
	BehaviorEvent,
	BehaviorEventMap,
	InferHandlerValue,
} from "./types";

export function defaultError(type: string, v: unknown) {
	return `value "${v}" of type "${typeof v}" is not assignable to ${type}`;
}

export function defaultMap(value: any) {
	return value;
}

export function throwError(error: string) {
	throw new Error(`${ERROR_PREFIX}: ${error}`);
}

export function publish<
	I extends Brand,
	O extends Brand,
	E extends BehaviorEvent
>(
	$behavior: Behavior<I, O>,
	event: E,
	value: InferHandlerValue<BehaviorEventMap<I, O>[E]>
) {
	const set = $behavior[DATA].listeners[event];

	if(set && set.size) {
		for(const handler of set.values()) {
			handler(value as any);
		}
	}
}

export function on<
	I extends Brand,
	O extends Brand,
	E extends BehaviorEvent
>(
	$behavior: Behavior<I, O>,
	event: E,
	handler: BehaviorEventMap<I, O>[E]
) {
	$behavior[DATA].listeners[event].add(handler as any);

	return () => {
		$behavior[DATA].listeners[event].delete(handler as any);
	};
}
