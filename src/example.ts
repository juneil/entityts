// @Entity()
// class User {

//     @Read(Joi.string().required())
//     @Update(Joi.any().strip())
//     id: string;

//     username: string;

//     password: string;

//     role: number;


// }

// @Entity()
// class User {

//     @property(
//         required: enum.CREATE, enum.UPDATE,
//         strip: enum.DELETE
//     }
//     id: string;

//     @property(
//         required: enum.UPDATE,
//         strip: enum.DELETE enum.CREAP
//     }
//     team: Team;

//     @Required(Mode.UPDATE)
//     @Strip([DELETE, CREATE])
//     @Type(Array<Entity.join(User)>)
//     @Default()
//     team_id: string;

//     set id(ooo) {
//         objectid => string
//     }
// }

// @Entity()
// class Team {

//     @property(
//         type: Joi.string().required()),
//         required: enum.CREATE,
//         strip: enum.DELETE
//     }
//     name: string;
// }

// Entity.validate(user, enum.CREATE, data);



// new User(payload)

// user.validate(enum.DELETE)


// username
// name

// new User({name})

// Mongoupdate(user) => {name: 'newNAME'} || {name:'newName', username: '' || undefined}
