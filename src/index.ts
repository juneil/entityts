import { Entity } from './decorators';

@Entity
export class Test {

    id: string;
}

// const t = new Test();
// console.log(t)


const tt = [null];

const f = tt!.concat(1);

console.log(f);