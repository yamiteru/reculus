# Reculus

## TODOs
[X] - Draft system
	[X] - Stash
	[X] - Drop
	[X] - Commit
[ ] - Utility functions
	[ ] - Filter
	[X] - Pipe
[ ] - Map / Validation
[ ] - Make Value secure 
[ ] - Batch
[ ] - Disposal

## Ideas
- Value constructors based on type (string, number, array, etc..) 
	- Could have built-in validations
	- Could create custom branded types
- Access to the previous value 
	- Could be useful for creating reactive history
	- Could be used in the setter function
- Rename watch to effect?
- Batching could be built-in
- `on` function to manually set subscriber
- `cleanup` function in effects
- What to do about nested/branched computations?
- Values are bound to be either T or undefined
	- It can introduce a lot of manual type checking

## API

### How to use

```ts
const search = value<string>("");
const count = value<number>(0);
const double = value<number>(
	// get(count) can be used instead
	() => $(count) * 2
);

watch(() => {
	console.log($(double));
});

// set(count, 1) can be used instead
$(count, 1);

stash(search, "he");
stash(search, "hello");
drop(search);
stash(search, "hola");
commit(search);
```

## Brainstorming
```ts
// default value + map/validation makes sense
// cannot define default value and map/validation in one prop
const double = value(0, (v) => v * 2);

// map/validation on computed is weird
// also what if I pass value into it from the outside?
const double = value((v??) => $(count) * 2);

// maybe computeds should do map/validation inside its Thunk
// but then there is the problem with nested auto-subscriptions

// so the Thunk must always subscribe top-level (no nesting)
// map/validation can return undefined to stop value propagation

// does thunk without auto-subscriptions make any sense?
// nope

// double gets value from count times two
// then if value is bigger than 10 it returns it as string
// if it's smaller or equal to 10 then it doesn't update
const double = value<number, string>(
	() => $(count) * 2,
	(v) => v > 10 ? `${v}`: undefined
);

// logically this makes sense but it's kinda crazy
// especially when it comes to type correctness

// the main problem is that computed values can be undefined
// if count is 1 then double will be undefined by default
// and that's problematic as hell because then it need manual type testing everywhere
// and that's really bad DX and we don't want that
// so computeds either must not have validations or provide default value
const double = value<number>(
	0,
	() => $(count) * 2,
	(v) => v > 10 ? `${v}`: undefined
);

// this kinda feels too heavy.. not really good DX
// maybe we could have just validations
// they would not run on the first run
// this way computeds would always have non-undefined value

const double = value(0)
	.from(() => $(count))
	.filter((v) => v > 10)
	.map((v) => v * 2);

// OOP feels more intuitive which kinda sucks
// but I should theoretically be able to validate both input and output
// right now I'm validating just one of them and it's not clear
// I think I could stack modifications based on when I define them
// this way I could do double filter (before and after map)

const double = value(0)
	.from(() => $(count))
	.filter((v, prev) => v !== prev)
	.map((v) => v * 2)
	.filter((v) => v > 10);

// it's almost perfect (apart from it being OOP)
// but now I can map in both .from and .map 
// so what's the difference? I see none which sucks

const double = value(0)
	.from(count)
	.filter((v, prev) => v !== prev)
	.map((v) => v * 2)
	.filter((v) => v > 10);

// but now I don't need the automatic dependency injection
// I mean we don't actually need it (maybe apart from effects)
// also manual dependency injection is faster so why not
// but I really hate the OOP here (mainly because the size)

const double = value(
	0
	from(count),
	filter((v, prev) => v !== prev),
	map((v) => v * 2),
	filter((v) => v > 10)
);

// ok now I've fixed the OOP size issue
// I'm not a fan of the "0" hanging there tho 
// maybe we could optinally curry the function?
// or create a pipe function that'd be passed as a second prop

const double = value(0)(
	from(count),
	filter((v, prev) => v !== prev),
	map((v) => v * 2),
	filter((v) => v > 10)
);

const count = value(0)();

const double = value(0, pipe(
	from(count),
	filter((v, prev) => v !== prev),
	map((v) => v * 2),
	filter((v) => v > 10)
));

// I can call from N times meaning I create nesting
// so we need to extract from somwehere in the beginning
// but at the same time I don't want to have more than 3 props

const count = value<number>(0);
const double = value<string>("0 USD", 
	from(
		[count],
		pipe(
			filter(([v], prev) => v !== prev),
			map((v) => v * 2),
			filter((v) => v > 10)
			map((v) => `${v} USD`)
		)
	)
);

// the from function does semi-automatic dependency injection
// which is really cool compromise between DX and performance
// value still needs I/O types when no from is used

const doubleUSD = value<number, string>(
	"0 USD", 
	pipe(
		filter((v, prev) => v !== prev),
		map((v) => `${v * 2} USD`)
	)
);

// do we want to allow setting value to computed value?
// logically it makes no sense because it gets the value from other Values
// but theoretically there might be edge-cases where it would make sense
// but at the same time it's very easy to shoot yourself in a foot this way
// so I guess we should disallow this behavior once from is called
// similar logic to automatic dependency injection could be used for this
// also we could internally mark the value as computed so set function could just check this value

// # default type validations

const count = int(0);
const double = int(0, from(
	...
));
const message = string("");
const price = float(0);
const items = array<Product>([]);
```
