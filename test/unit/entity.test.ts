import { suite, test } from 'mocha-typescript';
import * as unit from 'unit.js';

import { BaseEntity } from '../../src/entity';

@suite('Unit - Entity')
export class SuiteEntity {

    @test('---')
    test(done) {
        const f = new BaseEntity();
        done();
    }
}
