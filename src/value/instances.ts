import {value} from "./factory";
import {
	boolean,
	number,
	string
} from "./validations";

export const $string = value(string<"default">());
export const $number = value(number<"default">());
export const $boolean = value(boolean<"default">());
