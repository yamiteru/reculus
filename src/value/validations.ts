import {
	Assert,
	Object,
	TBoolean,
	TNumber,
	TObject,
	TString,
	Type
} from "../types";
import {
	assertType,
	createValidation, error,
} from "../utils";

export const string = createValidation<TString>((v) => {
	assertType(v, "string");
	return v as TString;
});

export const number = createValidation<TNumber>((v) => {
	assertType(v, "number");
	return v as TNumber;
});

export const boolean = createValidation<TBoolean>((v) => {
	assertType(v, "boolean");
	return v as TBoolean;
});

export const object = <
	T extends Object<Assert<Type>>,
	O extends Object<Type> = {
		[K in keyof T]: T[K] extends infer X
			? X extends Assert<infer Y>
				? Y
				: never
			: never;
	}
>(definition: T) => {
	return createValidation<TObject<"default", O>>((v) => {
		assertType<TObject<"default", O>>(v, "object");

		for(const key in definition) {
			if(!(key in v)) {
				error(`key "${key}" does not exist in value "${JSON.stringify(v)}"`);
			}

			definition[key]((v as any)[key]);
		}

		return v as TObject<"default", O>;
	});
};
