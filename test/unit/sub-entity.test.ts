import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';
import { Entity, Required, Type, Array } from '../../src';

@suite('Sub Entity')
export class SuiteSubEntity {

    @test('Sub Entity - Check sub entity validation')
    test1() {

        class Entity2 extends Entity {

            @Required()
            @Type(Boolean)
            foo: boolean
        }

        class Entity1 extends Entity {

            @Type(String)
            id: string

            @Array(Boolean)
            b: boolean[];

            @Type(Entity2)
            sub: Entity2;

        }

        unit
            .bool(Entity1.isValid(new Entity1(null, { strict: false })))
            .isTrue();

        unit
            .bool(Entity1.isValid(new Entity1({ sub: {} }, { strict: false })))
            .isFalse();

        unit
            .bool(Entity1.isValid(new Entity1({ sub: { foo: true } }, { strict: false })))
            .isTrue();

        unit
            .bool(Entity1.isValid(new Entity1({ sub: { foo: 'true' } }, { strict: false })))
            .isFalse();

        unit
            .bool(Entity1.isValid(new Entity1({ sub: { b: [{}] } }, { strict: false })))
            .isFalse();

    }
}
