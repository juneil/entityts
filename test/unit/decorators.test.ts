import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';

import { KEY_PROPS, decorators } from '../../src/symbols';
import { Entity, Type, Required, Strip, Valid, Invalid, Allow, Description, Min, Max, Length } from '../../src';

@suite('Decorators')
export class SuiteDecorators {

    @test('Metadata - Assign decorator in not BaseEntity class')
    test1() {

        class MyTest {

            @Type(String)
            property: string;

        }

        unit
            .value(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is(undefined);

    }

    @test('Metadata - Several decorators')
    test2() {

        class MyTest extends Entity {

            @Required()
            @Type(String)
            property: string;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .hasLength(1);

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest).pop().rules)
            .hasLength(2);

    }

    @test('Type - Check the metadata')
    test3() {

        class MyTest extends Entity {

            @Type(String)
            property: string;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([{
                property: 'property',
                rules: [
                    { key: decorators.KEY_TYPE, value: String }
                ]
            }]);

    }

    @test('Required - Check the metadata')
    test4() {

        class MyTest extends Entity {

            @Required(Entity.Mode.CREATE)
            property: string;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([{
                property: 'property',
                rules: [
                    { key: decorators.KEY_REQUIRED, value: [ Entity.Mode.CREATE ] }
                ]
            }]);

    }

    @test('Strip - Check the metadata')
    test5() {

        class MyTest extends Entity {

            @Strip(Entity.Mode.CREATE)
            property: string;

            @Strip()
            property2: string;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_STRIP, value: [ Entity.Mode.CREATE ] }
                    ]
                },
                {
                    property: 'property2',
                    rules: [
                        { key: decorators.KEY_STRIP, value: [ Entity.Mode.READ ] }
                    ]
                }
            ]);

    }

    @test('Valid - Check the metadata')
    test6() {

        class MyTest extends Entity {

            @Valid(1, 2)
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_VALID, value: [ 1, 2 ] }
                    ]
                }
            ]);

    }

    @test('Invalid - Check the metadata')
    test7() {

        class MyTest extends Entity {

            @Invalid(1, 2)
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_INVALID, value: [ 1, 2 ] }
                    ]
                }
            ]);

    }

    @test('Allow - Check the metadata')
    test8() {

        class MyTest extends Entity {

            @Allow(null)
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_ALLOW, value: [ null ] }
                    ]
                }
            ]);

    }

    @test('Description - Check the metadata')
    test9() {

        class MyTest extends Entity {

            @Description('blabla')
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_DESCRIPTION, value: 'blabla' }
                    ]
                }
            ]);

    }

    @test('Min - Check the metadata')
    test10() {

        class MyTest extends Entity {

            @Min(5)
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_MIN, value: 5 }
                    ]
                }
            ]);

    }

    @test('Max - Check the metadata')
    test11() {

        class MyTest extends Entity {

            @Max(5)
            property: number;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_MAX, value: 5 }
                    ]
                }
            ]);

    }

    @test('Length - Check the metadata')
    test12() {

        class MyTest extends Entity {

            @Length(50)
            property: string;

        }

        unit
            .array(Reflect.getOwnMetadata(KEY_PROPS, MyTest))
            .is([
                {
                    property: 'property',
                    rules: [
                        { key: decorators.KEY_LENGTH, value: 50 }
                    ]
                }
            ]);

    }
}
