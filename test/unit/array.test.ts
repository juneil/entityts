import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';

import { Entity, Required, Array, Min, Max, Length } from '../../src';

@suite('Array')
export class SuiteArray {

    @test('Array - Check array validation')
    test1() {

        class EntityTest extends Entity {

            @Required()
            @Array(String)
            data: string

        }

        unit
            .bool(EntityTest.isValid(new EntityTest({}, { strict: false })))
            .isFalse();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: 'data' }, { strict: false })))
            .isFalse();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: [] }, { strict: false })))
            .isTrue();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: ['test'] }, { strict: false })))
            .isTrue();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: [ 1 ] }, { strict: false })))
            .isFalse();

    }

    @test('Array - Min Max Length')
    test2() {

        class EntityTest extends Entity {

            @Min(2)
            @Max(5)
            @Array(Number)
            data: number

            @Length(3)
            @Array(Number)
            items: number

        }

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: [ 0 ] }, { strict: false })))
            .isFalse();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: [ 0, 1, 2, 3, 4, 5 ] }, { strict: false })))
            .isFalse();

        unit
            .bool(EntityTest.isValid(new EntityTest({ data: [ 0, 1, 2 ] }, { strict: false })))
            .isTrue();

        unit
            .bool(EntityTest.isValid(new EntityTest({ items: [ 0 ] }, { strict: false })))
            .isFalse();

        unit
            .bool(EntityTest.isValid(new EntityTest({ items: [ 0, 1, 2 ] }, { strict: false })))
            .isTrue();

    }
}
