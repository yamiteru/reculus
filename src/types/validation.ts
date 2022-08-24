import { Object } from "./general";

export type Type<
	T extends string = string,
	K extends any = any,
> = {
	__type: T;
	__kind: K;
};

export type Assert = (v: unknown) => void;

export type Validation<
	T extends Type
> = (v: InferType<T>) => void;

export type Check<
	T extends Type
> = (v: unknown) => T;

export type TypeOf<
	T extends Check<Type>
> = T extends Check<infer X>
	? X
	: never;

export type TString<
	N extends string
> = Type<`string:${N}`, string>;

export type TNumber<
	N extends string
> = Type<`number:${N}`, number>;

export type TBoolean<
	N extends string
> = Type<`boolean:${N}`, boolean>;

export type TArray<
	N extends string,
	T extends Type
> = Type<`array:${N}`, T[]>;

export type TObject<
	N extends string,
	T extends Object<Type>
> = Type<`object:${N}`, T>;

export type InferType<
	T extends Type | TArray<string, Type> | TObject<string, Object<Type>>
> = T extends TArray<string, infer X>
	? X extends Type
		? InferType<X>[]
		: X[]
	:	T extends TObject<string, infer X>
		? {
			[K in keyof X]: InferType<X[K]>;
		}
		: T extends Type<string, infer X>
		 ? X
		 : never;
