import { Observable } from 'watch-state';
export default class Async<V, E = unknown> extends Observable<V> {
    #private;
    get loaded(): boolean;
    get loading(): boolean;
    get error(): E;
    get value(): V;
    protected resolve(value: V): void;
    protected reject(e: E): void;
    update(): Promise<V>;
    then<TV, TE>(resolve: (value: V) => TV, reject?: (error: TE) => any): Promise<any>;
    catch<TE>(reject: (error: TE) => any): Promise<any>;
    finally(onFinally: () => void): Promise<V>;
    constructor(handler: () => Promise<V>, defaultValue?: V);
}
