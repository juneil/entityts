import * as Joi from 'joi';
import { PropertyMetadata, PropertyRule } from './decorators';
import { ModeEnum, TypeEnum } from './enums';
import { Entity } from './entity';
import { decorators } from './symbols';

interface PropertySchema {
    property: string;
    schemas: Joi.Schema[];
}

export { Schema as SchemaType } from 'joi';

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
                    schema: _.schemas.reduce((acc: Joi.AnySchema, cur) => acc.concat(cur), Joi.any())
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
            schemas: source
                .rules
                .map(_ => this.ruleHandler(_, mode))
                .filter(_ => !!_)
        }
    }

    private static ruleHandler(rule: PropertyRule, mode: ModeEnum): Joi.Schema {
        switch (rule.key) {
            case decorators.KEY_TYPE:
                return this.typeMapper(rule);
            case decorators.KEY_REQUIRED:
                return this.requireMapper(rule, mode);
            case decorators.KEY_STRIP:
                return this.stripMapper(rule, mode);
            case decorators.KEY_VALID:
                return this.validMapper(rule);
            case decorators.KEY_INVALID:
                return this.invalidMapper(rule);
            case decorators.KEY_ALLOW:
                return this.allowMapper(rule);
            case decorators.KEY_DESCRIPTION:
                return this.descriptionMapper(rule);
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
            case Date:
                return Joi.date();
            case TypeEnum.Hex:
                return Joi.string().hex();
            case TypeEnum.Base64:
                return Joi.string()['base64']();
            case TypeEnum.IsoDate:
                return Joi.string().isoDate();
            default:
                return Joi.any();
        }
    }

    private static requireMapper(rule: PropertyRule, mode: ModeEnum): Joi.Schema {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => Joi.any().required())
            .shift();
    }

    private static stripMapper(rule: PropertyRule, mode: ModeEnum): Joi.Schema {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => Joi.any().strip())
            .shift();
    }

    private static validMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().valid([]
            .concat(rule.value));
    }

    private static invalidMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().invalid([]
            .concat(rule.value));
    }

    private static allowMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().allow([]
            .concat(rule.value));
    }

    private static descriptionMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().description(rule.value);
    }
}


/**
 * min
 * max
 * length
 * 
 * ref
 * alternatives
 */
