// store/user.ts
// export const userStore = store(() => {
// 	const first_name = $string("");
// 	const second_name = $string("");
// 	const full_name = $string(
// 		"",
// 		() => `${first_name()} ${second_name()}`
// 	);
//
// 	return {
// 		first_name,
// 		second_name,
// 		full_name
// 	};
// });

// components/User.tsx
// export const User = () => {
// 	const { first_name, second_name, full_name } = useStore(userStore);
//
// 	onMount(() => {
// 		for(let i = 0; i < 10; ++i) {
// 			first_name(faker.name());
// 			second_name(faker.surname());
// 			commitLast();
// 			sleep(1000);
// 		}
// 	});
//
// 	return <div>{full_name()}</div>;
// };


// prototype

let sub_queue = new Set<any>();
let dep_queue = new Set();
let sub_current = null;
let has_derived = false;
let active_derivation: any = null;

function validation(fn: (data: any) => void) {
	return (data: unknown) => {
		fn(data);
	};
}

const number = validation((v) => {
	if(typeof v !== "number") {
		throw Error(`${v} of type ${typeof v} is not number`);
	}
});

const DATA = Symbol();

function behavior(validation: (data: unknown) => void) {
	return (initial: unknown, map: (initial: unknown) => unknown = (v) => v) => {
		const id = Symbol();

		let current = initial;

		const update = (v?: unknown) => {
				current = map(v);

				ret.subs.size && sub_queue.add(instance);

				// there are more derivations
				if(ret.tail.size) {
					// update all derived values
					// TODO: merge tails of tails
					// (how should we do this?)
					for(const b of ret.tail.values()) {
						(b as any).prototype[DATA].update()
					}
				}

				// this value is the last derivation
				else {
					for(const b of sub_queue.values()) {
						// const v = b();

						// console.log(b);

						// for(const c of b.protype[DATA].subs.values()) {
						// 	c(v);
						// }
					}

					sub_queue.clear();
				}
		};

		console.log(has_derived);

		const ret = {
			id,
			update,
			derived: has_derived,
			// TODO: does it make sense to not include head/tail until needed?
			head: new Set(),
			tail: new Set(),
			// TODO: initialize on-demand
			subs: new Set()
		};

		function instance(v?: unknown) {
			if(v !== undefined) {
				if(ret.derived === false) {
					update(v);
				}
			} else if(active_derivation) {
				has_derived = true;
				active_derivation.prototype[DATA].head.add(instance);
				instance.prototype[DATA].tail.add(active_derivation);
			}

			return current;
		}

		instance.prototype[DATA] = ret;
		active_derivation = instance;

		sub_current = () => {
			current = map(undefined);
		};

		current = map(initial);

		sub_current = null;
		has_derived = false;
		active_derivation = null;

		return instance;
	};
}

function subscribe(behavior: any, callback: (v: unknown) => void) {
	behavior.prototype[DATA].subs.add(callback);
}

const $number = behavior(number);

const count = $number(0);
const double1 = $number(0, () => (count() as number) * 2);
const double2 = $number(0, () => (count() as number) * 2);
const sum = $number(0, () => (double1() as number) + (double2() as number));

subscribe(sum, (v) => console.log("sum", v));

count(1);
count(2);
count(3);

// console.log({
// 	sub_queue,
// 	has_derived,
// 	active_derivation
// });

console.log("count", count.prototype[DATA]);
console.log("double1", double1.prototype[DATA]);
console.log("double2", double2.prototype[DATA]);
console.log("sum", sum.prototype[DATA]);

