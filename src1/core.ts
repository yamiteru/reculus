import { Behavior, Listener, Brand, InferKind } from "./types";
import { DATA, CACHE } from "./constants";

export function get<
	I extends Brand,
	O extends Brand
>($behavior: Behavior<I, O>) {
	if(CACHE.reactiveUpdateListener) {
		CACHE.mapDidInjectDependencies = true;
		$behavior[DATA].listeners.value.add(
			CACHE.reactiveUpdateListener
		);
	}

	return $behavior[DATA].value;
}

export function set<
	I extends Brand,
	O extends Brand
>(
	$behavior: Behavior<I, O>,
	nextValue: InferKind<I>
) {
	const mappedValue = $behavior[DATA].map(
		nextValue,
		{
			input: nextValue,
			previous:	$behavior[DATA].previous
		}
	);

	if(mappedValue !== undefined) {
		$behavior[DATA].previous = {
			input: nextValue,
			output: mappedValue
		};

		$behavior[DATA].value = mappedValue;

		for(const listener of $behavior[DATA].listeners.value.values()) {
			listener(mappedValue);
		}

		return mappedValue;
	}

	return $behavior[DATA].value;
}

export function $<
	I extends Brand,
	O extends Brand
>(
	$behavior: Behavior<I, O>,
	nextValue?: InferKind<I>
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
