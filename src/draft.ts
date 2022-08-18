import { Behavior, Type, InferType } from "./types";
import { DATA } from "./constants";
import { set } from "./core";

export function stash<
	I extends Type,
	O extends Type
>(
	$behavior: Behavior<I, O>,
	nextValue: InferType<I>
) {
	$behavior[DATA].draft = nextValue;
}

export function drop<
	I extends Type,
	O extends Type
>($behavior: Behavior<I, O>) {
	$behavior[DATA].draft = undefined;
}

export function commit<
	I extends Type,
	O extends Type
>($behavior: Behavior<I, O>) {
	const draft = $behavior[DATA].draft;

	drop($behavior);
	set($behavior, draft as any);
}
