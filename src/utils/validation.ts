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

// numbers

export function gt(value: number) {
	return (v: number) => {
		if(!(v > value)) {
			error(`value "${v}" should be greater than "${value}"`);
		}
	};
}

export function gte(value: number) {
	return (v: number) => {
		if(!(v >= value)) {
			error(`value "${v}" should be greater or equal to "${value}"`);
		}
	};
}

export function lt(value: number) {
	return (v: number) => {
		if(!(v < value)) {
			error(`value "${v}" should be smaller than "${value}"`);
		}
	};
}

export function lte(value: number) {
	return (v: number) => {
		if(!(v <= value)) {
			error(`value "${v}" should be smaller or equal to "${value}"`);
		}
	};
}

export function int(v: number) {
	if(!Number.isInteger(v)) {
		error(`value "${v}" shoule be integer`);
	}
}

export function float(v: number) {
	if(Number.isInteger(v)) {
		error(`value "${v}" shoule be float`);
	}
}

export function positive(v: number) {
	gt(0)(v);
}

export function nonpositive(v: number) {
	lte(0)(v);
}

export function negative(v: number) {
	lt(0)(v);
}

export function nonnegative(v: number) {
	gte(0)(v);
}

export function multipleOf(value: number) {
	return (v: number) => {
		if(v % value !== 0) {
			error(`value "${v}" should be multiple of "${value}"`);
		}
	};
}

// strings

export function min(value: number) {
	return (v: string) => {
		if(v.length < value) {
			error(`value "${v}" should have minimum length of "${value}"`);
		}
	};
}

export function max(value: number) {
	return (v: string) => {
		if(v.length > value) {
			error(`value "${v}" should have maximum length of "${value}"`);
		}
	};
}

export function length(value: number) {
	return (v: string) => {
		if(v.length !== value) {
			error(`value "${v}" should have length of "${value}"`);
		}
	};
}

export function regex(value: string) {
	return (v: string) => {
		if(v.match(value) === null) {
			error(`value "${v}" should match regex "${value}"`);
		}
	};
}

export function startsWith(value: string) {
	return (v: string) => {
		if(v.indexOf(value) !== 0) {
			error(`value "${v}" should start with "${value}"`);
		}
	};
}

export function endsWith(value: string) {
	return (v: string) => {
		if(v.lastIndexOf(value) !== v.length - 1) {
			error(`value "${v}" should end with "${value}"`);
		}
	};
}
