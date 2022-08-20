import { 
	TNumber, 
	TInt, 
	TFloat, 
	TString, 
	TChar, 
	TObject, 
	TArray, 
	Validator, 
	Brand,
	ValidatorObject,
	TBool
} from "./types";
import { throwError } from "./utils";

export function assertType<T>(value: unknown, type: string): asserts value is T {
	const valueType = typeof value;
	
	if(valueType !== type) {
		throwError(`value "${value}" of type "${valueType}" is not of type "${type}"`);
	}	
}

export function assertLength(value: any, length: number) {
	if(value?.length !== length) {
		throwError(`value "${value}" of length "${value.length}" instead of "${length}"`);
	}
}
											
export function assertInt(value: unknown): asserts value is TInt {
	if(!Number.isInteger(value)) {
		throwError(`value "${value}" is not an int`);
	}
}

export function assertObjectKey<
	T extends Record<any, any>
>(object: T, key: keyof T) {
	if(key in object === false) {
		throwError(`key "${String(key)}" does not exist in "${JSON.stringify(object)}"`);
	}
}

export function assertFloat(value: unknown): asserts value is TFloat {
	if(Number.isInteger(value)) {
		throwError(`value "${value}" is not a float`);
	}
}

export function assertObject<
	T extends Record<any, any>
>(value: unknown, keys: string[]): asserts value is T {
	assertType<T>(value, "object");			

	if(value === null || Array.isArray(value)) {
		throwError(`value "${value}" is not an object`);
	}

	for(let i = 0; i < keys.length; ++i) {
		if(keys[i] in value === false) {
			throwError(`key "${keys[i]}" does not exist in "${JSON.stringify(value)}"`);
		}	
	}
}

export function assertArray<
	T extends any[]
>(value: unknown): asserts value is T {
	if(!Array.isArray(value)) {
		throwError(`value "${value}" of type "${typeof value}" is not an array`);
	}	
}

export function assertTruthy<T>(value: unknown): asserts value is T {
	if(value === false || value === null || value === undefined) {
		throwError(`value "${value}" is not truthy value`);
	}
}

export const object = <
	N extends string,
	T extends Record<any, Brand>
>(definition: ValidatorObject<T>): Validator<TObject<T, N>> => {
	return (value) => {
		assertObject<T>(
			value, 
			Object.keys(definition)
		);

		for(const key in definition) {
			(definition as any)[key](value[key]);
		}
	};
};

export const array = <
	N extends string,
	T extends Brand
>(definition: Validator<T>): Validator<TArray<T[], N>> => {
	return (value) => {
		assertArray<T[]>(value);		

		for(let i = 0; i < value.length; ++i) {
			(definition as any)(value[i]);
		}
	};
};

export const string: Validator<TString> = (value) => {
	assertType(value, "string");
};

export const char: Validator<TChar> = (value) => {
	string(value);
	assertLength(value, 1);
};

export const number: Validator<TNumber> = (value) => {
	assertType(value, "number"); 
};

export const int: Validator<TInt> = (value) => {
	number(value);
	assertInt(value);
};

export const float: Validator<TFloat> = (value) => {
	number(value);
	assertFloat(value);
};

export const bool: Validator<TBool> = (value) => {
	bool(value);
};

export function validate<T>(
	validator: Validator<T>, 
	value: unknown
) {
	try {
		validator(value);
		
		return {
			data: value,
			error: undefined
		};
	} catch(e: any) {
		return {
			data: undefined,
			error: e.message as string
		};
	}
}
