type Either<L, R> = L | R;
type Nullable<T> = Either<T, null>;
type Thunk<T> = () => T;
type Noop = Thunk<void>;

type Listener = Noop;
type Value<T> = {
	id: symbol;
	value: T;
	listeners: Set<Listener>;
};

// current watch listener
let _listener: Nullable<Listener> = null;

// watch listeners with record of their
// dependencies with unsubscription
const _dependencies: Map<
	Listener, 
	Record<symbol, Listener>	
> = new Map();

// watches changes in values who's 
// values are used in the listener
// it automatically auto-subscribes 
export function watch(listener: Listener) {
	_listener = listener;
	_dependencies.set(listener, {});

	listener();
	
	_listener = null;

	return () => {
		const dependencies = _dependencies.get(listener);

		if(dependencies) {
			for(const key in dependencies) {
				(dependencies[key as any] as Listener)();
			}
		}
	};
}

// creates static or computed reactive value
// it automatically auto-subscribers
export function value<T>(initialValue: T | Thunk<T>) {
	const isFunction = typeof initialValue === "function";
	const $value: Value<T> = {
		id: Symbol(),
		value: undefined as any,
		listeners: new Set()
	};

	if(isFunction) {
		watch(() => {
			set($value, (initialValue as Thunk<T>)());
		});
	} else {
		$value.value = initialValue;
	}

	return $value as Value<T>;
}

// returns current value
// subscribes current listener to value
export function get<T>($value: Value<T>) {
	if(_listener) {
		const listener = _listener;
		const dependencies = _dependencies.get(listener);
		const id = $value.id;

		if(dependencies && id in dependencies === false) {
			$value.listeners.add(listener);			
			
			dependencies[id] = () => {
				$value.listeners.delete(listener);	
			};
		}
	}
	
	return $value.value;
}

// sets value to nextValue
// and notifies listeners
export function set<T>($value: Value<T>, nextValue: T) {
	$value.value = nextValue;
	
	for(const listener of $value.listeners.values()) {
		listener();
	}

	return nextValue;
}

// facade for get and set
export function $<T>($value: Value<T>, nextValue?: T) {
	return nextValue === undefined
		? get($value)
		: set($value, nextValue);
}
