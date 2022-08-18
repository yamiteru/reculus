import { DATA } from "./constants";

export type Either<L, R> = L | R;
export type Maybe<T> = Either<T, undefined>;
export type Nullable<T> = Either<T, null>;
export type Listener = () => void;
export type Lambda<I, O> = (value: I) => O;

export type Cache = {
	mapDidInjectDependencies: boolean;
	reactiveUpdateListener: Nullable<Listener>;
};

export type Behavior<
	I extends Type, 
	O extends Type
> = {
	[DATA]: {
		id: symbol;
		value: O;
		draft: Maybe<I>;
		listeners: Set<Listener>;		
		map: Lambda<I, Maybe<InferType<O>>>;
	}
};

export type InferBehaviors<T extends Type[]> = {
	[K in keyof T]: Behavior<any, T[K]>;
};

export type Pipe<
	I extends Type,
	T extends Type[],
	F extends Lambda<any, any>[]
> = T extends [infer Head, ...infer Tail]
	? Pipe<Head, Tail, [...F, Lambda<I, Maybe<InferType<Head>>>]>
	: T extends [infer Head]
		? [...F, Lambda<I, Maybe<InferType<Head>>>]
		: F;
	
export type InferPipeOutput<
	T extends Type[]
> = T extends [...infer _, infer O]
	?	InferType<O> 
	: never;

export type Type<
	T = any, 
	N extends string = string
> = T & { __type: N, __kind: T };

export type Int = Type<number, "int">;
export type Float = Type<number, "float">;
export type Bool = Type<boolean, "bool">;
export type Str = Type<string, "str">;
export type Char = Type<string, "char">;

export type InferType<
	T extends Type<any, string>
> = T extends Type<infer I, string>
	?	I
	: never;
