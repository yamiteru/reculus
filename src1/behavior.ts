import { Map, Brand, Behavior, Validator, InferKind, ValidatorObject, State } from "./types";
import { string, char, number, int, float, bool, object, array } from "./validation";
import { DATA, CACHE, ERROR_PREFIX } from "./constants";
import { defaultMap } from "./utils";
import { set } from "./core";

export function behavior<O extends Brand>(
	validation: Validator<O>,
) {
	return <I extends Brand = O>(
		initialValue: InferKind<O>,
		map: Map<I, O> = defaultMap
	): Behavior<I, O> => {
		validation(initialValue);

		const $behavior: Behavior<I, O> = {
			[DATA]: {
				id: Symbol(),
				alive: true,
				previous: {
					input: undefined,
					output: undefined
				},
				value: initialValue,
				draft: undefined,
				listeners: {
					value: new Set(),
					stash: new Set(),
					drop: new Set(),
					commit: new Set(),
					dispose: new Set()
				},
				map: (value: InferKind<I>, state: State<I, O>) => {
					CACHE.mapDidInjectDependencies = false;

					const _ = map(value, state);

					if(_ !== undefined) {
						validation(_);
					}

					return _;
				}
			}
		};

		CACHE.reactiveUpdateListener = () => {
			set($behavior, undefined as any);
		};

		try {
			const newValue = $behavior[DATA].map(
				undefined as any,
				{
					input: $behavior[DATA].value as any,
					previous: $behavior[DATA].previous
				}
			);

			if(CACHE.mapDidInjectDependencies && newValue !== undefined) {
				$behavior[DATA].previous = {
					input: undefined as any,
					output: newValue
				};

				$behavior[DATA].value = newValue;
			}
		} catch(e: any) {
			const message = e?.message;

			$behavior[DATA].previous = {
				input: undefined as any,
				output: initialValue
			};

			if(message && message.indexOf(ERROR_PREFIX) === -1) {
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
