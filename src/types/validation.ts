import {Object} from "./general";

export type Assert<T> = (v: unknown) => T;

export type Type<
	T extends string = string,
	K extends any = any,
> = {
	__type: T;
	__kind: K;
};

export type TString = Type<"string", string>;
export type TChar = Type<"char", string>;
export type TNumber = Type<"number", number>;
export type TInt = Type<"int", number>;
export type TFloat = Type<"float", number>;
export type TBoolean = Type<"boolean", boolean>;

export type TArray<
	N extends string,
	T extends Type
> = Type<`array:${N}`, T>;

export type TObject<
	N extends string,
	T extends Object<Type>
> = Type<`object:${N}`, T>;

export type InferType<
	T extends TArray<string, Type> | TObject<string, Object<Type>> | Type
> = T extends TArray<any, infer X>
	? InferType<X>[]
	: T extends TObject<any, infer X>
		? { [K in keyof X]: InferType<X[K]>; }
		:	T extends Type<any, infer X>
			? X
			: never;
