import { Entity } from './entity';
import { Type, Required } from './decorators'
import { TypeEnum } from './enums'

class Test extends Entity  {

    @Type(TypeEnum.Hex)
    @Required()
    id: string;

    @Type(String)
    name: string

}

const t = new Test({ name: 1 });

// t.name = 'HELLO';

console.log(t)