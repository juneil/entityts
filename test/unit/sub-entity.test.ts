import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';

import { Entity, Required, Type } from '../../src';

@suite('Sub Entity')
export class SuiteSubEntity {

    @test('Sub Entity - Check sub entity validation')
    test1() {

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

        unit
            .bool(new Entity1(null, { strict: false }).isValid())
            .isTrue();

        unit
            .bool(new Entity1({ sub: {} }, { strict: false }).isValid())
            .isFalse();

        unit
            .bool(new Entity1({ sub: { id: 'abc' } }, { strict: false }).isValid())
            .isTrue();

    }
}
