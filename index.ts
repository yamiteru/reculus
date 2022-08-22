import {
	$,
	effect,
	number,
	object,
	string,
	value
} from "./src";

const person = object({
	name: string(),
	age: number()
});

const $person = value(person());

// const me = $person({} as any);

// effect(() => {
// 	console.log($(me));
// });

// $(me, {} as any);
