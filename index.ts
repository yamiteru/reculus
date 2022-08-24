import { $, dispose, effect, number, subscribe, value } from "./src";

const _count = number<"count">();
const $count = value(_count);

const count = $count(0);

const doubleCount = $count(0, () => {
	const c = $(count);

	return c === undefined
		? undefined
		: c * 2;
});

effect(() => {
	console.log($(doubleCount));
});

subscribe(count, "dispose", () => {
	console.log("Count has been disposed");
});

$(count, 1);
$(count, 2);

dispose(count);

$(count, 3);
