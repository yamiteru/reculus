import { Behavior, Brand, InferKind } from "./types";
import { DATA } from "./constants";
import { set } from "./core";

export function stash<
	I extends Brand, 
	O extends Brand
>(
	$behavior: Behavior<I, O>, 
	nextValue: InferKind<I> 
) {
	$behavior[DATA].draft = nextValue;
}

export function drop<
	I extends Brand, 
	O extends Brand
>($behavior: Behavior<I, O>) {
	$behavior[DATA].draft = undefined;
}

export function commit<
	I extends Brand, 
	O extends Brand
>($behavior: Behavior<I, O>) {
	const draft = $behavior[DATA].draft;

	drop($behavior);
	set($behavior, draft as any);
}
