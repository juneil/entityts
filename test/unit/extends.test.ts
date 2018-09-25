import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';
import * as Joi from 'joi';

import { Entity, Required, Type, Strip } from '../../src';
import { EntityExtends } from '../../src/lib/entity';

@suite('Extends Entity')
export class SuiteSubEntity {

    @test('Extends Entity - Check if property is well overwritted')
    test1(done) {

        class Entity1 extends Entity {

            @Type(String)
            id: string

            @Required()
            @Type(String)
            prop1: string

            @Strip()
            @Type(String)
            prop2: string

        }

        class Entity1Extended extends EntityExtends(Entity1) {

            @Required()
            @Type(Number)
            id: number

            @Strip()
            @Type(String)
            prop1: string

        }

        const res1 = Joi.validate({ id: 'id', prop1: 'data', prop2: 'andmore' }, Entity1.schema());
        unit
            .object(res1.value)
            .is({ id: 'id', prop1: 'data' });

        const res2 = Joi.validate({ id: 0, prop1: 'toto', prop2: 'yyo' }, Entity1Extended.schema());
        unit
            .object(res2.value)
            .is({ id: 0 });

        done();
    }
}
