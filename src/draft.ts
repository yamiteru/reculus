import { Behavior, Brand, InferKind } from "./types";
import { DATA } from "./constants";
import { set } from "./core";
import { publish } from "./utils";

export function stash<
	I extends Brand,
	O extends Brand
>(
	$behavior: Behavior<I, O>,
	nextValue: InferKind<I>
) {
	$behavior[DATA].draft = nextValue;
	publish($behavior, "stash", nextValue);
}

export function drop<
	I extends Brand,
	O extends Brand
>($behavior: Behavior<I, O>) {
	$behavior[DATA].draft = undefined;
	publish($behavior, "drop", undefined);
}

export function commit<
	I extends Brand,
	O extends Brand
>($behavior: Behavior<I, O>) {
	const draft = $behavior[DATA].draft;

	drop($behavior);

	if(draft !== undefined) {
		set($behavior, draft as any);
	}

	publish($behavior, "commit", undefined);
}
