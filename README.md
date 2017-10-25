# EntityTS

### Introduction

The idea is to use the power of Typescript/Decorators to have an easy and practical entity library.

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
user.isValid() // true

const user2 = new User();
user.isValid() // false

```