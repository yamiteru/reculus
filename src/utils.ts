import { ERROR_PREFIX } from "./constants";
import { Type, Behavior, InferType, InferPipeOutput, InferBehaviors, Lambda, Maybe, Pipe } from "./types";
import { get } from "./core";

export function defaultError(type: string) {
	return (v: unknown) => {
		return `value "${v}" of type "${typeof v}" is not assignable to ${type}`;
	};
}

export function defaultMap(value: any) {
	return value;
}

export function throwError(error: string) {
	throw new Error(`${ERROR_PREFIX}: ${error}`);
}

export function from<
	I extends Type[],
	O,
	T extends Behavior<any, any>[] = InferBehaviors<I>
>(
	$behaviors: T,
	map: Lambda<I, Maybe<InferType<O>>>
) {
	return () => {
		const values: I = [] as any;

		for(let i = 0; i < $behaviors.length; ++i) {
			values.push(get($behaviors[i]));
		}

		return map(values);
	};
}

export function pipe<
	I extends Type[], 
	T extends Type[], 
	O = InferPipeOutput<T> | undefined,
	F extends Lambda<Type, any>[] = Pipe<I, T, []>
>(...fns: F) {
	return (value: I) => {
		let _ = value as any;
	
		for(let i = 0; i < fns.length; ++i) {
			const tmp = (fns[i] as any)(_);

			if(tmp === undefined) {
				return undefined;
			}

			_ = tmp;
		}

		return _ as O;
	};
}

export function filter<T extends Type>(predicate: Lambda<T, boolean>) {
	return (value: InferType<T>) => predicate(value) 
		? value
		: undefined;
}

export function map<
	I extends Type,
	O extends Type
>(map: Lambda<I, Maybe<InferType<O>>>) {
	return (value: I) => map(value);
}


