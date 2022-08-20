import { Type, InferType, Maybe, Lambda, Behavior } from "./types";
import { DATA, CACHE, ERROR_PREFIX } from "./constants";
import { defaultMap, throwError } from "./utils";
import { set } from "./core";

export function type<O extends Type>(
	validation: (v: unknown) => boolean,
	error: (v: unknown) => string
) {
	return <I extends Type = O>(
		initialValue: InferType<O>,
		map: Lambda<I, Maybe<InferType<O>>> = defaultMap
	) => {
		if(!validation(initialValue)) {
			throwError(error(initialValue));
		}

		const $behavior: Behavior<I, O> = {
			[DATA]: {
				id: Symbol(),
				value: initialValue,
				draft: undefined,
				listeners: new Set(),
				map: (value: I) => {
					CACHE.mapDidInjectDependencies = false;

					const _ = map(value);

					if(_ !== undefined && !validation(_)) {
						throwError(error(_));
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
