export { Entity, EntityTo, EntityRef } from './entity';
export { Type, Required, Strip, Valid, Invalid, Allow, Description, Min, Max, Length } from './decorators';
export { JoiTransformer } from './transformers'






// import { Entity, EntityTo } from './entity';
// import { Type, Required, Strip, Length, Min } from './decorators';
// import { JoiTransformer, SchemaType } from './transformers/joi.transformer';

// import * as Joi from 'joi';

// import { KEY_PROPS } from './symbols';



// export class User extends EntityTo(JoiTransformer)  {

//     @Type(String)
//     @Required(Entity.Mode.READ)
//     @Strip(Entity.Mode.CREATE, Entity.Mode.UPDATE)
//     id: string;

//     @Type(String)
//     @Length(10)
//     name: string

//     @Min(5)
//     @Type(Number)
//     test: number;

// }

// export class Test extends EntityTo(JoiTransformer) {
    
//     @Type(String)
//     @Length(10)
//     name: string

// }

// User.schema();
// Test.schema();


// const t = new Test();

// console.log(User.schema());

// const t = new User({ name: 'ddd', '__v': 'ddd' });

// User.isValidate(Entity.Mode.CREATE);

// console.log(Joi.validate(t, User.schema()))
// console.log('===============');
// console.log(Joi.validate(t, User.schema(Entity.Mode.UPDATE)))

// console.log(t.isValid());
// console.log(t.isValid(Entity.Mode.UPDATE));

// const u = new User({ name: 'name', test: 'name' });
// u.id = 'null';
// console.log(Joi.validate(u, User.schema()))

// const sch = <Joi.ObjectSchema>User.schema();


// const ns = Joi.any().concat(sch).concat(Joi.object().keys({
//     id: Joi.reach(<Joi.ObjectSchema>sch, 'id')
//             .when('name',  {
//                 is: 'test',
//                 then: Joi.string().valid('OK'),
//                 otherwise: Joi.string().valid('NOK')
//             })
// }));
// const sch = <Joi.ObjectSchema>User.schema();
// const ns = sch.keys({
//     id: Joi.reach(sch, 'id')
//     .when('name',  {
//         is: 'test',
//         then: Joi.string().valid('OK'),
//         otherwise: Joi.string().valid('NOK')
//     })
// });

// console.log(ns.validate({ name: 'testtestaa', id: 'yo', test: 0 }));
