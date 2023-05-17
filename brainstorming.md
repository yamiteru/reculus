```ts
// values could be pausable
const cart = object(
	count: number(),
	price: number(),
);

const cart = $cart({ count: 0, price: 0 });
const sum = $number(0, from(
	cart,
	({ count, price }) => count * price
));

const logger = _string();

// import { string, number } from "reculus/value";
// import { string, number } from "reculus/event";

// we could make validation drop-in so user can use
// whatever they want and prefer

// using Zod for validations
const $user = value(object({
	first_name: string,
	second_name: string,
	age: number
}));

// pass all dependencies
// needs to return unsubscription
effect(
	[count, double],
	([c, p]) => console.log({
		count: c,
		double: d
	})
);

// pass only changed dependency
// needs to return unsubscription
// string key for event type is limiting
on(
	[count, double],
	"value",
	(v) => publish(logger, v)
)

// count.stash/drop/commit/value/dispose
on(
	count.dispose,
	() => console.log("count disposed")
);
```
