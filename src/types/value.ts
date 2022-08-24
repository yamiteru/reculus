import {DATA} from "../constants";
import {InferType, Type} from "./validation";
import {Either, Maybe, Nullable} from "./general";

export type Previous<
	I extends Type,
	O extends Type
> = {
	input: Maybe<InferType<I>>;
	output: Maybe<InferType<O>>;
};

export type State<
	I extends Type,
	O extends Type
> = {
	input: Maybe<InferType<I>>;
	previous: Previous<I, O>;
};

export type EventMap<
	I extends Type,
	O extends Type
> = {
	value: O;
	stash: I;
	drop: undefined;
	commit: undefined;
	dispose: undefined;
};

export type EventSets<
	I extends Type,
	O extends Type,
	M = EventMap<I, O>
> = {
	[K in keyof M]: (
		Nullable<Set<(value: M[K]) => void>>
	);
};

export type EventHandler<
	I extends Type,
	O extends Type,
	K extends keyof EventMap<any, any>
> = (value: EventMap<I, O>[K]) => void;

export type Map<
	I extends Type,
	O extends Type
> = (
	value: InferType<I>,
	state: State<I, O>
) => Either<undefined, InferType<O>>;

export type Value<
	I extends Type,
	O extends Type
> = {
	[DATA]: {
		id: symbol;
		alive: boolean;
		value: {
			draft: Maybe<I>;
			current: O;
			previous: Previous<I, O>;
		};
		event: EventSets<I, O>;
		map: Map<I, O>;
	};
};
