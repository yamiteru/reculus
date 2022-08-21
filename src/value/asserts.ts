import {Assert, TBoolean, TChar, TFloat, TInt, TNumber, TString} from "../types";
import {assertChar, assertFloat, assertInt, assertType} from "../utils";

export const string: Assert<TString> = (v: any) => {
	return assertType(v, "string");
};

export const char: Assert<TChar> = (v: any) => {
	assertType(v, "string");
	return assertChar(v);
};

export const number: Assert<TNumber> = (v: any) => {
	return assertType(v, "number");
};

export const boolean: Assert<TBoolean> = (v: any) => {
	return assertType(v, "boolean");
};

export const int: Assert<TInt> = (v: any) => {
	assertType(v, "number");
	return assertInt(v);
};

export const float: Assert<TFloat> = (v: any) => {
	assertType(v, "number");
	return assertFloat(v);
};
