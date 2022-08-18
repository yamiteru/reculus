import { Str, Char, Int, Float, Bool } from "./types";
import { defaultError } from "./utils";
import { type } from "./type";

export const str = type<Str>(
	(v) => typeof v === "string",
	defaultError("str")
);

export const char = type<Char>(
	(v) => typeof v === "string",
	defaultError("char")
);

export const int = type<Int>(
	(v) => typeof v === "number",
	defaultError("int")
);

export const float = type<Float>(
	(v) => typeof v === "number",
	defaultError("float")
);

export const bool = type<Bool>(
	(v) => typeof v === "boolean",
	defaultError("bool")
);
