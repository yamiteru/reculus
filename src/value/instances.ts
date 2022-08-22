import {value} from "./factory";
import {
	boolean,
	number,
	string
} from "./validations";

export const $string = value(string());
export const $number = value(number());
export const $boolean = value(boolean());
