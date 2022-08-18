# Reculus

## TODOs
[X] - Draft system
	[X] - Stash
	[X] - Drop
	[X] - Commit
[X] - Utility functions
	[X] - Filter
	[X] - Map
	[X] - Pipe
[X] - Map / Validation
[X] - Make Value secure 
[ ] - Previous IO values
[ ] - Batch
[ ] - Disposal

## Ideas
- `on` function to manually set subscriber
- `cleanup` function in effects

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
	- bool
- Numerical
	- number
	- int
	- float
-	Textual 
	- str
	- char
- Array
	- array
	- tuple
- Object
	- object

## Reactivity

#### `set<I, O>($behavior: Behavior<I, O>, nextValue: I): O`

#### `get<I, O>($behavior: Behavior<I, O>): O`
