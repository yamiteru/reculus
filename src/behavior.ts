import { Brand, Maybe, Lambda, Behavior, Validator, InferKind, ValidatorObject } from "./types";
import { string, char, number, int, float, bool, object, array } from "./validation";
import { DATA, CACHE, ERROR_PREFIX } from "./constants";
import { defaultMap } from "./utils";
import { set } from "./core";

export function behavior<O extends Brand>(
	validation: Validator<O>, 
) {
	return <I extends Brand = O>(
		initialValue: InferKind<O>, 
		map: Lambda<InferKind<I>, Maybe<InferKind<O>>> = defaultMap
	): Behavior<I, O> => {
		validation(initialValue);

		const $behavior: Behavior<I, O> = {
			[DATA]: {
				id: Symbol(),
				alive: true,
				value: initialValue,
				draft: undefined,
				listeners: {
					value: new Set(),
					stash: new Set(),
					drop: new Set(),
					commit: new Set(),
					dispose: new Set()
				},
				map: (value: I) => {
					CACHE.mapDidInjectDependencies = false;
					
					const _ = map(value as any);

					if(_ !== undefined) {
						validation(_);
					}

					return _ as any;
				}
			}
		};
		
		CACHE.reactiveUpdateListener = () => {
			set($behavior, undefined as any);			
		};
			
		try {
			const newValue = $behavior[DATA].map($behavior[DATA].value as any);	

			if(CACHE.mapDidInjectDependencies && newValue !== undefined) {
				$behavior[DATA].value = newValue;
			}
		} catch(e: any) {
			const message = e?.message;

			if(message && message.indexOf(ERROR_PREFIX) === 0) {
				throw Error(message);
			}
		}
		
		CACHE.reactiveUpdateListener = null;
		
		return $behavior;
	};			
}

export const $string = behavior(string);
export const $char = behavior(char);
export const $number = behavior(number);
export const $int = behavior(int);
export const $float = behavior(float);
export const $bool = behavior(bool);
export const $object = <
	N extends string,
	T extends Record<any, Brand>
>(definition: ValidatorObject<T>) => {
	return behavior(object<N, T>(definition));
}
export const $array = <
	N extends string,
	T extends Brand
>(definition: Validator<T>) => {
	return behavior(array<N, T>(definition));
};
