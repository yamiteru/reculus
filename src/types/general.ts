export type Object<T = any> = Record<any, T>;

export type Either<L, R> = L | R;
export type Maybe<T> = Either<undefined, T>;
export type Nullable<T> = Either<null, T>;
export type Thunk<T> = () => T;
export type Noop = Thunk<void>;
