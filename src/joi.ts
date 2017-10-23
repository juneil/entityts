import * as Joi from 'joi';
import { PropertyMetadata, PropertyRule } from './decorators';
import { ModeEnum, TypeEnum } from './enums';
import { KEY_REQUIRED, KEY_STRIP, KEY_TYPE } from './symbols';
import { Entity } from './entity';

interface PropertySchema {
    property: string;
    base: Joi.Schema;
    rules: string[];
}

export class JoiBuilder {

    static build(source: PropertyMetadata[], mode: ModeEnum = ModeEnum.READ) {
        return this.reduceSchema(source.map(_ => this.propertyHandler(_, mode)));
    }

    static isValid(data: Entity, schema: Joi.Schema): boolean {
        return !Joi.validate(data, schema).error;
    }

    private static reduceSchema(source: PropertySchema[]) {
        return Joi.object().keys(
            source
                .map(_ => ({
                    property: _.property,
                    schema: _.rules.reduce((acc, cur) => acc[cur].apply(acc, []), _.base)
                }))
                .reduce((acc, cur) => {
                    acc[cur.property] = cur.schema;
                    return acc;
                }, {})
        );
    }

    private static propertyHandler(source: PropertyMetadata, mode: ModeEnum): PropertySchema {
        return {
            property: source.property,
            base: source
                .rules
                .filter(_ => _.key === KEY_TYPE)
                .map(_ => <Joi.Schema>this.ruleHandler(_, mode))
                .shift(),
            rules: source
                .rules
                .filter(_ => _.key !== KEY_TYPE)
                .map(_ => <string>this.ruleHandler(_, mode))
                .filter(_ => !!_)
        }
    }

    private static ruleHandler(rule: PropertyRule, mode: ModeEnum): Joi.Schema | string {
        switch (rule.key) {
            case KEY_TYPE:
                return this.typeMapper(rule);
            case KEY_REQUIRED:
                return this.requireMapper(rule, mode);
            case KEY_STRIP:
                return this.stripMapper(rule, mode);
            default:
                return Joi.any();
        }
    }

    private static typeMapper(rule: PropertyRule): Joi.Schema {
        switch (rule.value) {
            case String:
                return Joi.string();
            case Number:
                return Joi.number();
            case Boolean:
                return Joi.boolean();
            case Object:
                return Joi.object();
            case Buffer:
                return Joi.binary();
            case TypeEnum.Hex:
                return Joi.string().hex();
            case TypeEnum.Base64:
                return Joi.string()['base64']();
            default:
                return Joi.any();
        }
    }

    private static requireMapper(rule: PropertyRule, mode: ModeEnum): string {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => 'required')
            .shift();
    }

    private static stripMapper(rule: PropertyRule, mode: ModeEnum): string {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => 'strip')
            .shift();
    }
}
