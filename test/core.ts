import { get, int, effect, $ } from '../src/index';
import { DATA } from "../src/constants";

describe('testing core functionality', () => {
	describe('get', () => {
		it('should return same value if called two times', () => {
			const value = int(0);

			expect(get(value)).toBe(0);
			expect(get(value)).toBe(0);
		});
	});

	describe('effect', () => {
		// TODO: Here should probable be fixture.
		it.each([
			[0, [1, 2, 3]],
			[5, [5, 8, 12, 52, 987]]
		])('should be called every time if filter isn\'t used', (
			init_value: number,
			fill: number[]
		) => {
			const mockCallback = jest.fn();

			const count = int(init_value);
			effect(() => {
				mockCallback($(count));
			});

			fill.forEach((v) => {
				$(count, v);
			});

			// Magical +1 is because effect is called also with initial state.
			expect(mockCallback).toBeCalledTimes(fill.length + 1);
			expect(mockCallback.mock.calls).toEqual([
				[init_value],
				...fill.map((v) => [v])])
		});
	});
});
