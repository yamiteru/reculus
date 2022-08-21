import {$int, effect, get, set} from "./src";

const count = $int(0, (v) => v * 2);

effect(() => {
	console.log(get(count));
});

set(count, 1);
set(count, 2);
set(count, 3);
