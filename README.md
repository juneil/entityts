# EntityTS

### Introduction

The idea is to use the power of Typescript/Decorators to have an easy and practical entity library.
Based on a transformer system, this library use Joi to transform the entities to Validation Schemas.

### How to install

`npm install --save @juneil/entityts`

### Usage

```javascript

import { Entity, Type, Required } from '@juneil/entityts';

class User extends Entity {

    @Type(Entity.Type.Hex)
    @Length(10)
    @Required()
    id: string;

    @Type(String)
    name: string;

}

const user1 = new User({ id: '1DB6A7FF08' });
user1.isValid() // true

const user2 = new User();
user2.isValid() // false

```

### Static methods

- `schema(ModeEnum): Joi.Schema`
    - Build and return the schema for a mode

### Instance methods

- `schema(ModeEnum): Joi.Schema`
    - Build and return the schema for a mode
- `isValid(ModeEnum): boolean`
    - Based on the schema, valid the instance

### Decorators

#### Type
```javascript
@Type(String | Number | Date | Object | Boolean | Buffer | TypeEnum | *Entity)
```
Specify the type of the property's value and will be the base of the Schema

*Entity: Allow you to have a property with the type of an Entity. Example:

```javascript
class Entity2 extends Entity {
    @Required()
    @Type(String)
    id: string

}
class Entity1 extends Entity {
    @Type(String)
    id: string

    @Type(Entity2)
    sub: Entity2
}
new Entity1().isValid()                         // true
new Entity1({ sub: {} }).isValid()              // false
new Entity1({ sub: { id: 'abc' } }).isValid()   // true
```

#### Array
```javascript
@Array(String | Number | Date | Object | Boolean | Buffer | TypeEnum | *Entity)
```
Same as @Type() but with array.

#### Required
```javascript
@Required(...ModeEnum) // By default: Entity.Mode.READ
```
Set the property as required, can be setted for several modes

#### Strip
```javascript
@Strip(...ModeEnum) // By default: Entity.Mode.READ
```

The property will be removed depending of the modes provided

#### Valid
```javascript
@Valid(...any)
```

Set the valid values for the property

#### Invalid

```javascript
@Invalid(...any)
```

Set the invalid values for the property

#### Allow

```javascript
@Allow(...any)
```

Set the allowed values for the property

#### Min

```javascript
@Min(number)
```

Add Min validation for the property's value.
Works with types: `String | Number | Array | Buffer | TypeEnum`

#### Max

```javascript
@Max(number)
```

Add Max validation for the property's value.
Works with types: `String | Number | Array | Buffer | TypeEnum`

#### Length

```javascript
@Length(number)
```

Add Length validation for the property's value.
Works with types: `String | Array | Buffer | TypeEnum`

#### Description

```javascript
@Description(string)
```

Add description metadata to the property

### TypeEnum

- `Entity.Type.Any`: any
- `Entity.Type.ObjectId`: String ObjectId from mongodb
- `Entity.Type.Hex`: String in hexadecimal format
- `Entity.Type.Base64`: String in base64 format
- `Entity.Type.IsoDate`: String in iso date format

### ModeEnum

- `Entity.Mode.READ`: Default mode
- `Entity.Mode.CREATE`: Mode to use while creating in a datasource
- `Entity.Mode.UPDATE`: Mode to use while updating in a datasource
