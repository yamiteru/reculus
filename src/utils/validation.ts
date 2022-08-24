import { Assert, Check, InferType, Type, Validation } from "../types";
import { error } from "./error";

export function assertType(type: string) {
	return (v: unknown) => {
		const valueType = typeof v;

		if(valueType !== type) {
			error(`value "${v}" of type "${valueType}" should be "${type}"`);
		}
	}
}

export function assertArray() {
	return (v: unknown) => {
		if(!Array.isArray(v)) {
			error(`value "${v}" of type "${typeof v}" should be "array"`);
		}
	};
}

export function createValidation<
	T extends Type
>(
	assert: Assert,
	...validations: Validation<T>[]
) {
	return (v: unknown) => {
		assert(v);

		for(const validation of validations) {
			validation(v as InferType<T>);
		}

		return v as T;
	};
}

export function validate<
	T extends Type
>(
	type: Check<T>,
	value: InferType<T>
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
			data: type(value) as InferType<T>,
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
