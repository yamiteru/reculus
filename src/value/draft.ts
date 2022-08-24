import { DATA } from "../constants";
import { InferType, Type, Value } from "../types";
import { publish, set } from "./utils";

export function stash<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>,
	nextValue: InferType<I>
) {
	if(valueInstance[DATA]) {
		valueInstance[DATA].value.draft = nextValue;
		publish(valueInstance, "stash", nextValue);
	}
}

export function drop<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>
) {
	if(valueInstance[DATA]) {
		valueInstance[DATA].value.draft = undefined;
		publish(valueInstance, "drop", undefined);
	}
}

export function commit<
	I extends Type,
	O extends Type
>(
	valueInstance: Value<I, O>
) {
	if(valueInstance[DATA]) {
		const ctx = valueInstance[DATA];
		const draft = ctx.value.draft;

		if(draft !== undefined) {
			set(valueInstance, draft as InferType<I>);
			drop(valueInstance);

			publish(valueInstance, "commit", undefined);
		}
	}
}
