# Reculus

### WritableBehavior/ReadableBehavior
```ts
import { set, on, kill, draft, commit, drop } from "reculus";
import { r$int } from "reculus/writable";
import { w$int } from "reculus/readable";

const count = w$int(0);
const price = w$int(0, (v, p) => v === p ? NONE: v);
const double = r$int(0, [ count ], ([v]) => v * 2); 
const sum = r$int(0, [double, price], 
	([d, p]) => d * p,
	(v) => `${v} USD`
)

effect([count.next, double.error], ([cN, dE]) => {
	...
});

// onNext 
on(double.next, console.log);
// onError
on(double.error, ...);
// onKill
on(double.kill, ...);
// onDraft
on(double.draft, ...);
// onDrop
on(double.drop, ...);
// onCommit
on(double.commit, ...);

// next(count, 1);
set(count, 1); // 2

draft(count, 2);
draft(count, 3);

drop(count);

// set(count.draft, 4)
draft(count, 4);
commit(count);

kill(double);

// error(double, "error")
set(double.error, "error")

batch(() => {
	set(count, 1);
	set(price, 100);
});
```

## API
## Validation
Since TypeScript gets compiled away so our TS types are always a lie we need a way to validate out data and assert their type. This is the only way we can be sure that out data types are correct. And since we get most of our data from 3rd party we always need to validate them either way so why not make it a core of the library.

### `type<T>(predicate: (value: any) => boolean, error: (value: any) => string)`
You can create custom data validations by creating your own runtime reactive type. This function was used to create the default data types listed below. This is how you use it.

```ts
const number = type<number>(
	(value) => typeof value === "number",
	(value) => `value of type ${typeof value} is not number`
);
````

All of the data types below have this template:  
```ts
number<T = number>(
	initialValue: number | (value: T) => number, 
	map?: (value: T) => number | undefined
)
```

#### Types
- Boolean
	- `bool()`
- Numerical
	- `number()`
	- `int()`
	- `float()`
- Textual 
	- `str`
	- `char()`

## Reactivity

#### `set<I, O>($behavior: Behavior<I, O>, nextValue: I): O`

#### `get<I, O>($behavior: Behavior<I, O>): O`
