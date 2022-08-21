import {error} from "./error";
import {TChar, TFloat, TInt} from "../types";


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
