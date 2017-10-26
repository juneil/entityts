import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';

import { BaseEntity, EntityRef } from '../../src/entity';
import { Entity, EntityTo, Type, JoiTransformer } from '../../src';

@suite('Entity')
export class SuiteEntity {

    @test('Constructor - Populate the instance')
    test1() {

        class MyTest extends Entity {

            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        const instance = new MyTest({ id: 'abc', name: 'myname' });

        unit
            .object(instance)
            .isInstanceOf(BaseEntity)
            .hasProperty('id', 'abc')
            .hasProperty('name', 'myname');

    }

    @test('Constructor - Populate the instance with extra properties')
    test2() {

        class MyTest extends Entity {

            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        const instance = new MyTest({ id: 'abc', name: 'myname', a: 3, b: false });

        unit
            .object(instance)
            .isInstanceOf(BaseEntity)
            .hasProperty('id', 'abc')
            .hasProperty('name', 'myname')
            .hasNotProperty('a')
            .hasNotProperty('b');

    }

    @test('Constructor - Create empty instance')
    test3() {

        class MyTest extends Entity {

            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        const instance = new MyTest();

        unit
            .object(instance)
            .isInstanceOf(BaseEntity)
            .hasProperty('id', undefined)
            .hasProperty('name', undefined)

    }

    @test('Transformers - Default')
    test4() {

        class MyTest extends Entity {

            @Type(String)
            id: string;

        }

        unit
            .array(MyTest['transformers'])
            .hasLength(1);

    }

    @test('Transformers - Two transformers')
    test5() {

        class MyTest extends EntityTo(JoiTransformer, JoiTransformer) {

            @Type(String)
            id: string;

        }

        unit
            .array(MyTest['transformers'])
            .hasLength(2);

    }

    @test('Transformers - No Transformers')
    test6() {

        class MyTest extends EntityTo() {

            @Type(String)
            id: string;

        }

        unit
            .array(MyTest['transformers'])
            .hasLength(0);

        unit
            .value(MyTest.schema())
            .is(undefined);

    }

    @test('EntityRef')
    test7() {

        class MyTest extends Entity {

            @Type(String)
            id: string;

        }

        unit
            .object(MyTest.ref('id'))
            .isInstanceOf(EntityRef)
            .hasProperty('ref', 'id');

    }

    @test('Entity - Without metadata')
    test8() {

        class MyTest8 extends Entity {

            id: string;

        }

        unit
            .value(MyTest8.schema())
            .is(undefined);

    }
}
