import { Entity } from './entity';
import { Type, Required, Strip } from './decorators';

import * as Joi from 'joi';

// import { KEY_PROPS } from './symbols';

class User extends Entity  {

    @Type(String)
    @Required(Entity.Mode.READ)
    @Strip([ Entity.Mode.CREATE, Entity.Mode.UPDATE ])
    id: string;

    @Type(String)
    name: string

}

// const t = new Test();

// console.log(User.schema());

const t = new User({ name: 'ddd', '__v': 'ddd' });

//User.isValidate(Entity.Mode.CREATE);

console.log(Joi.validate(t, User.schema()))
console.log('===============');
console.log(Joi.validate(t, User.schema(Entity.Mode.UPDATE)))

console.log(t.isValid());
console.log(t.isValid(Entity.Mode.UPDATE));