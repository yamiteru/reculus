import { Type, Behavior, InferType, Listener } from "./types";
import { DATA, CACHE } from "./constants";

export function get<
	I extends Type, 
	O extends Type
>($behavior: Behavior<I, O>) {
	if(CACHE.reactiveUpdateListener) {
		CACHE.mapDidInjectDependencies = true;
		$behavior[DATA].listeners.add(CACHE.reactiveUpdateListener);		
	}
	
	return $behavior[DATA].value;
}

export function set<
	I extends Type, 
	O extends Type
>(
	$behavior: Behavior<I, O>,
	nextValue: InferType<I> 
) {
	const mappedValue = $behavior[DATA].map(nextValue);

	if(mappedValue !== undefined) {
		$behavior[DATA].value = mappedValue;
		
		for(const listener of $behavior[DATA].listeners.values()) {
			listener();
		}

		return mappedValue;
	}

	return $behavior[DATA].value;
}

export function $<
	I extends Type, 
	O extends Type
>(
	$behavior: Behavior<I, O>, 
	nextValue?: InferType<I> 
) {
	return nextValue !== undefined
		? set($behavior, nextValue)
		: get($behavior);
}

export function effect(listener: Listener) {
	CACHE.reactiveUpdateListener = listener;

	listener();

	CACHE.reactiveUpdateListener = null;
}

