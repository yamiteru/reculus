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

export type Validator<T> = (value: unknown) => asserts value is T;

export type Brand<
	T extends any = any, 
	N extends string = string 
> = { __type: T, __kind: N };

export type InferType<
	T extends Validator<any>
> = T extends Validator<infer X>
	? X
	: never;

export type InferKind<
	T extends Brand<any, string>
> = T extends Brand<infer X, infer _>
	? X extends Record<any, Brand> | Brand[]
		? InferKinds<X>
		: X
	: never;

export type InferKinds<
	T extends Record<any, Brand> | Brand[]
> = T extends Record<any, Brand> 
	? {
		[K in keyof T]: InferKind<T[K]>;	
	}
	: T extends (infer X)[]
		? X extends Brand 
			? InferKind<X>[] 
			: never
		: never;

export type TString = Brand<string, "str">;
export type TChar = Brand<string, "char">;
export type TNumber = Brand<number, "num">;
export type TInt = Brand<number, "int">;
export type TFloat = Brand<number, "float">;
export type TBool = Brand<boolean, "bool">;
export type TObject<
	T extends Record<any, Brand>, 
	N extends string
> = Brand<T, N>;
export type TArray<
	T extends Brand[], 
	N extends string
> = Brand<T, N>;

export type ValidatorObject<
	T extends Record<any, Brand>
> = {
	[K in keyof T]: Validator<T[K]>;
};

export type InferObject<
	T extends Record<any, Validator<any>>
> = {
	[K in keyof T]: T[K] extends Validator<infer X>
		? X
		: never;
};

export type BehaviorEvent =
	| "value"
	| "stash"
	| "commit"
	| "drop"
	| "dispose";

export type Behavior<
	I extends Brand, 
	O extends	Brand 
> = {
	[DATA]: {
		id: symbol;
		alive: boolean;
		value: O;
		draft: Maybe<I>;
		listeners: {
			value: Set<Listener>;		
			stash: Set<(value: InferKind<I>) => void>;
			drop: Set<() => void>;
			commit: Set<() => void>;
			dispose: Set<() => void>;
		},
		map: Lambda<InferKind<I>, Maybe<InferKind<O>>>;
	}
};

export type InferBehaviors<T extends Brand[]> = {
	[K in keyof T]: Behavior<any, T[K]>;
};
