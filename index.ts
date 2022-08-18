import { map, filter, int, $, effect, pipe, from, Int, Behavior } from "./src";

const doubleMap = map<Int, Int>((v) => v * 2);

const divisibleByThreeFilter = filter<Int>(
	(v) => v % 3 === 0
);

const extractFirstItemMap = map<Int[], Int>(
	([value]) => value
);

const doubleDivisibleByThreePipe = pipe<[Int], [Int, Int, Int]>(
	extractFirstItemMap,
	doubleMap,
	divisibleByThreeFilter
);

const doubleFrom = ($behavior: Behavior<any, Int>) => {
	return from<[Int], Int>(
		[$behavior],
		doubleDivisibleByThreePipe	
	);
};

const count = int(0);
const double = int(0, doubleFrom(count));

effect(() => {
	console.log({
		double1: $(double),
		double2: $(double),
	});
});

$(count, 1);
$(count, 2);
$(count, 3);
