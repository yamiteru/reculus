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
	T extends Record<any, Brand> | Brand[] | Brand
> = T extends Record<any, Brand>
	? {
		[K in keyof T]: InferKind<T[K]>;
	}
	: T extends (infer X)[]
		? X extends Brand
			? InferKind<X>[]
			: never
		: T extends Brand
			? InferKind<T>
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

export type BehaviorEventMap<
	I extends Brand,
	O extends Brand
> = {
	value: (value: O) => void;
	stash: (value: I) => void;
	commit: (value: undefined) => void;
	drop: (value: undefined) => void;
	dispose: (value: undefined) => void;
};

export type InferHandlerValue<
	T extends ((value: any) => void)
> = T extends ((value: infer X) => void)
	? X
	: never;

export type Previous<
	I extends Brand | Brand[] | Record<any, Brand>,
	O extends Brand
> = {
	input: Maybe<InferKinds<I>>;
	output: Maybe<InferKind<O>>;
};

export type State<
	I extends Brand,
	O extends Brand
> = {
	input: InferKind<I>;
	previous: Previous<I, O>;
};

export type Map<
	I extends Brand,
	O extends Brand
> = (
	value: InferKind<I>,
	state: State<I, O>
) => Maybe<InferKind<O>>;

export type Listeners<
	I extends Brand,
	O extends Brand
> = {
	value: Set<BehaviorEventMap<I, O>["value"]>;
	stash: Set<BehaviorEventMap<I, O>["stash"]>;
	drop: Set<BehaviorEventMap<I, O>["drop"]>;
	commit: Set<BehaviorEventMap<I, O>["commit"]>;
	dispose: Set<BehaviorEventMap<I, O>["dispose"]>;
};

export type Behavior<
	I extends Brand,
	O extends	Brand
> = {
	[DATA]: {
		id: symbol;
		alive: boolean;
		previous: Previous<I, O>;
		value: O;
		draft: Maybe<I>;
		listeners: Listeners<I, O>;
		map: Map<I, O>;
	}
};

export type InferBehaviors<T extends Brand[]> = {
	[K in keyof T]: Behavior<any, T[K]>;
};
