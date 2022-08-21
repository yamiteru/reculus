import {Noop, Nullable} from "./general";

export type Cache = {
	reactiveUpdateListener: Nullable<Noop>;
	mapDidInjectDependencies: boolean;
};
