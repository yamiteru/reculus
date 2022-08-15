# Reculus

### TODOs
[ ] - Draft system
	[ ] - Stash
	[ ] - Drop
	[ ] - Commit
[ ] - Utility functions
	[ ] - Filter
	[ ] - Pipe
[ ] - Map / Validation
[ ] - Make Value secure 

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
