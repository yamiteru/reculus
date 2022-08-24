import {
	InferType,
	Object,
	TArray,
	TBoolean,
	TNumber,
	TObject,
	TString,
  Type,
  Check,
	Validation
} from "../types";
import {
	assertArray,
  assertType,
	createValidation,
	error,
} from "../utils";

export const string = <
	N extends string,
	O extends Type = TString<N>
>(...validations: Validation<O>[]) =>
	createValidation<O>(
		assertType("string"),
		...validations
	);

export const number = <
	N extends string,
	O extends Type = TNumber<N>
>(...validations: Validation<O>[]) =>
	createValidation<O>(
		assertType("number"),
		...validations
	);

export const boolean = <
	N extends string,
	O extends Type = TBoolean<N>
>(...validations: Validation<O>[]) =>
	createValidation<O>(
		assertType("boolean"),
		...validations
	);

export const array = <
	N extends string
>() => <
	T extends Type
>(
	type: Check<T>
) => <
	O extends TArray<string, any> = TArray<N, T>
>(...validations: Validation<O>[]) =>
	createValidation<O>(
		assertArray(),
		...validations,
		(v: InferType<O>) => {
			for(let i = 0; i < v.length; ++i) {
				type(v[i]);
			}
		}
	);

export const object = <
	N extends string
>() => <
	T extends Object<Type>
>(types: {
	[K in keyof T]: Check<T[K]>;
}) => <
	O extends TObject<string, any> = TObject<N, T>
>(...validations: Validation<O>[]) =>
	createValidation<O>(
		assertType("object"),
		...validations,
		(v: InferType<O>) => {
			for(const key in types) {
				if(!(key in v)) {
					error(`key "${key}" does not exist in "${JSON.stringify(v)}"`);
				}

				types[key]((v as any)[key]);
			}
		}
	);
