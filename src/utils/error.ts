import {ERROR_PREFIX} from "../constants";

export function error(message: string) {
	throw Error(`${ERROR_PREFIX}: ${message}`);
}
