import 'reflect-metadata';

export function Entity<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        extract() { return 'test' }
        newProperty = "new property";
        hello = "override";
    }
}
