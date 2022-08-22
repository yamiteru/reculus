import {error} from "./error";
import {Assert, InferType, TChar, TFloat, TInt, Type} from "../types";

export function assertType<T>(value: any, type: string): asserts value is T {
	const valueType = typeof value;

	if(valueType !== type) {
		error(`value "${value}" of type "${valueType}" should be type "${type}"`);
	}
}

export function assertInt(value: any): asserts value is TInt {
	if(!Number.isInteger(value)) {
		error(`value "${value}" is not int`);
	}
}

export function assertFloat(value: any): asserts value is TFloat {
	if(Number.isInteger(value)) {
		error(`value "${value}" is not float`);
	}
}

export function assertChar(value: any): asserts value is TChar {
	if(value.length !== 0) {
		error(`value "${value}" is not char`);
	}
}

export function createValidation<
	T extends Type
>(assert: Assert<T>) {
	return (
		...checks: ((v: InferType<T>) => void)[]
	): Assert<T> =>
		(v) => {
			assert(v);

			for(const check of checks) {
				check(v as InferType<T>);
			}

			return v as T;
		};
}

export function validate<
	T extends Type
>(
	assert: Assert<T>,
	value: unknown
): {
	valid: true;
	data: InferType<T>;
	error: undefined;
} | {
	valid: false;
	data: undefined;
	error: string;
} {
	try {
		return {
			valid: true,
			data: assert(value) as InferType<T>,
			error: undefined
		};
	} catch(e: any) {
		return {
			valid: false,
			data: undefined,
			error: e.message
		};
	}
}
