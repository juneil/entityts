import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';
import * as Joi from 'joi';
import { BaseEntity } from '../../src/entity';
import { Entity, EntityTo, JoiTransformer,
    Type, Required, Strip, Valid, Invalid, Allow, Description, Min, Max, Length } from '../../src';

@suite('JoiTransformer')
export class SuiteJoi {

    @test('Build - Get schema - valid')
    test1() {

        class MyTest extends EntityTo(JoiTransformer) {

            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        unit
            .object(MyTest.schema());

        unit
            .bool(!Joi.validate({}, MyTest.schema()).error)
            .isTrue()

    }

    @test('Build - Get schema - invalid')
    test2() {

        class MyTest extends EntityTo(JoiTransformer) {

            @Required()
            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        unit
            .object(MyTest.schema());

        unit
            .bool(!Joi.validate({}, MyTest.schema()).error)
            .isFalse()

    }

    @test('IsValid')
    test3() {

        class MyTest extends EntityTo(JoiTransformer) {

            @Required()
            @Type(String)
            id: string;

            @Type(String)
            name: string;
        }

        const instance = new MyTest({ name: 'name' });

        unit
            .object(instance)
            .isInstanceOf(BaseEntity)
            .hasProperty('name', 'name');

        unit
            .bool(instance.isValid())
            .isFalse()

    }

    @test('Schema - Full')
    test4() {

        class User extends EntityTo(JoiTransformer) {

            @Description('Unique ID')
            @Required()
            @Length(10)
            @Strip(Entity.Mode.CREATE, Entity.Mode.UPDATE)
            @Type(Entity.Type.Hex)
            id: string;

            @Required()
            @Min(0)
            @Max(10)
            @Type(String)
            name: string;

            @Required()
            @Min(18)
            @Max(77)
            @Type(Number)
            age: number;

            @Required(Entity.Mode.CREATE)
            @Type(Entity.Type.Base64)
            @Invalid(null)
            password: string

            @Required(Entity.Mode.CREATE)
            @Type(Entity.Type.Base64)
            @Valid(Entity.ref('password'))
            password_conf: string

            @Type(Buffer)
            @Min(10)
            @Max(50)
            @Length(40)
            data: Buffer;

            @Type(Date)
            @Min(10)
            @Max(50)
            @Length(40)
            @Allow(null, Entity.ref('age'))
            birthday: Date;

            @Type(Array)
            @Min(10)
            @Max(50)
            @Length(40)
            pics: Array<any>;

            @Type(Boolean)
            admin: boolean

            @Type(Object)
            profile: Object;

            @Type(Entity.Type.IsoDate)
            date: string;

            @Type(Entity.Type.ObjectId)
            mongoId: string;

            @Valid(null)
            useless: string;

        }

        const instance1 = new User({ id: '23BC67F00A', name: 'Juneil', age: 28, birthday: null })

        unit
            .bool(instance1.isValid())
            .isTrue();
        unit
            .bool(instance1.isValid(Entity.Mode.CREATE))
            .isFalse();

        const instance2 = new User({ name: 'Juneil', age: 28, password: 'eW8=', password_conf: 'eW8=', birthday: 28 });

        unit
            .bool(instance2.isValid())
            .isFalse();
        unit
            .bool(instance2.isValid(Entity.Mode.CREATE))
            .isTrue();

        const instance3 = new User({ name: 'Juneil', age: 28, password: 'eW8=', password_conf: 'eQ8=' });

        unit
            .bool(instance3.isValid(Entity.Mode.CREATE))
            .isFalse();

    }
}
