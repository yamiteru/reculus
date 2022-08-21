import {Object} from "./general";

export type Assert<T> = (v: any) => asserts v is T;

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
export type TArray<T extends Type> = Type<"array", T>;
export type TObject<T extends Object<Type>> = Type<"object", T>;

export type InferType<
	T extends TArray<Type> | TObject<Object<Type>> | Type
> = T extends TArray<infer X>
	? InferType<X>[]
	: T extends TObject<infer X>
		? { [K in keyof X]: InferType<X[K]> }
		:	T extends Type<any, infer X>
			? X
			: never;
