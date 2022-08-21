import {value} from "./factory";
import {boolean, char, float, int, number, string} from "./asserts";

export const $string = value(string);
export const $char = value(char);
export const $number = value(number);
export const $boolean = value(boolean);
export const $int = value(int);
export const $float = value(float);
