import { effect, $, object, string, int, array, float, behavior, $int } from "./src";

const gradesValidator = array(float);

const personValidator = object({
	name: string,
	age: int,
	grades: gradesValidator
});

const $person = behavior(personValidator);

const count = $int(0);

const me = $person({
	name: "Yamiteru",
	age: 25,
	grades: [12.5] 
});

effect(() => {
	console.log($(me));
});

effect(() => {
	console.log($(count));
});

$(count, 2);
