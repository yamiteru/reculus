import { DATA, ERROR_PREFIX } from "./constants";
import { Brand, Behavior, InferBehaviors, Lambda, Maybe, InferKind } from "./types";
import { get } from "./core";

export function defaultError(type: string, v: unknown) {
	return `value "${v}" of type "${typeof v}" is not assignable to ${type}`;
}

export function defaultMap(value: any) {
	return value;
}

export function throwError(error: string) {
	throw new Error(`${ERROR_PREFIX}: ${error}`);
}

export function from<
	I extends Brand[],
	O extends Brand,
	T extends Behavior<any, any>[] = InferBehaviors<I>
>(
	$behaviors: T,
	map: Lambda<I, Maybe<InferKind<O>>>
) {
	return () => {
		const values: I = [] as any;

		for(let i = 0; i < $behaviors.length; ++i) {
			values.push(get($behaviors[i]));
		}

		return map(values);
	};
}

export function filter<
	T extends Brand
>(predicate: Lambda<InferKind<T>, boolean>) {
	return (value: InferKind<T>) => predicate(value) 
		? value
		: undefined;
}

export function map<
	I extends Brand,
	O extends Brand = I
>(map: Lambda<InferKind<I>, Maybe<InferKind<O>>>) {
	return (value: InferKind<I>) => map(value);
}

export function tap<
	T extends Brand
>(fn: (value: T) => T) {
	return (value: T) => {
		fn(value);
		return value;
	};
}

// TODO: implement
// on(count, "value", (value) => ...);
// on(count, "dispose", () => ...);
export function on<
	I extends Brand,
	O extends Brand
>(
	$behavior: Behavior<I, O>,
	event: string,
	handler: (value: unknown) => void
) {
	
	
	return () => {
		// $behavior[DATA].listeners.delete(handler);
	};
}
