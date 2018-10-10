import * as Joi from 'joi';
import { PropertyMetadata, PropertyRule } from '../lib/decorators';
import { ModeEnum, TypeEnum } from '../lib/enums';
import { BaseEntity, EntityRef, EntityTransformer, EntityOptions } from '../lib/entity';
import { decorators } from '../lib/symbols';

interface PropertySchema {
    property: string;
    base: Joi.Schema;
    schemas: Joi.Schema[];
}

export { ObjectSchema as SchemaType } from 'joi';

export class JoiTransformer implements EntityTransformer<Joi.ObjectSchema | Joi.ArraySchema> {

    private objectIdRegex = /^[0-9a-fA-F]{24}$/;

    build(source: PropertyMetadata[], opts: EntityOptions, more: Joi.ObjectSchema = Joi.object(),
            parent?: BaseEntity): Joi.ObjectSchema | Joi.ArraySchema {
        opts.unknown = opts.unknown === undefined || opts.unknown === null ? true : opts.unknown;
        const result = !source ? undefined : more.concat(
            this.reduceSchema(source.map(_ => this.propertyHandler(_, opts.mode, opts.unknown)),
                opts.unknown, !!parent ? parent.schema(opts) : undefined)
        );
        if (!!opts.array) {
            return Joi.array().items(result);
        }
        return result;
    }

    isValid(data: BaseEntity, schema: Joi.ObjectSchema): boolean {
        return !!data && !Joi.validate(data, schema, {
            stripUnknown: true,
            convert: false
        }).error;
    }

    validate(data: any, schema: Joi.ObjectSchema) {
        return Joi.validate(data, schema, {
            stripUnknown: true,
            convert: false
        });
    }

    /**
     * Merge all rules and
     * reduce to an Object Schema
     *
     * @param  {PropertySchema[]} source
     * @returns Joi.ObjectSchema
     */
    private reduceSchema(source: PropertySchema[], unknown: boolean, parent?: Joi.ObjectSchema): Joi.ObjectSchema {
        const _s = !!parent ? parent : Joi.object();
        const res = _s.keys(
            source
                .map(_ => ({
                    property: _.property,
                    schema: _.schemas.reduce((acc: Joi.AnySchema, cur) => acc.concat(cur), _.base)
                }))
                .reduce((acc, cur) => {
                    acc[cur.property] = cur.schema;
                    return acc;
                }, {})
        );
        return !!unknown ? res.unknown() : res;
    }

    /**
     * Property handler
     * Get the base schema
     * and map all rules in joi schema
     *
     * @param  {PropertyMetadata} source
     * @param  {ModeEnum} mode
     * @returns PropertySchema
     */
    private propertyHandler(source: PropertyMetadata, mode: ModeEnum, unknown: boolean): PropertySchema {
        const base = source
            .rules
            .filter(_ => _.key === decorators.KEY_TYPE || _.key === decorators.KEY_ARRAY || _.key === decorators.KEY_OBJECT_PATTERN)
            .map(_ => this.ruleHandler(_, mode, unknown))
            .shift() || Joi.any();
        return {
            property: source.property,
            base,
            schemas: source
                .rules
                .filter(_ => (_.key !== decorators.KEY_TYPE && _.key !== decorators.KEY_ARRAY && _.key !== decorators.KEY_OBJECT_PATTERN))
                .map(_ => this.ruleHandler(_, mode, unknown, base))
                .filter(_ => !!_)
        }
    }

    /**
     * Rule handler
     * Call the right mapper for
     * a decorator's key
     *
     * @param  {PropertyRule} rule
     * @param  {ModeEnum} mode
     * @param  {Joi.Schema} base
     * @returns Joi.Schema
     */
    private ruleHandler(rule: PropertyRule, mode: ModeEnum, unknown: boolean, base?: Joi.Schema): Joi.Schema {
        switch (rule.key) {
            case decorators.KEY_TYPE:
                return this.typeMapper(rule, mode, unknown);
            case decorators.KEY_ARRAY:
                return Joi.array().items(this.typeMapper(rule, mode, unknown));
            case decorators.KEY_REQUIRED:
                return this.requireMapper(rule, mode);
            case decorators.KEY_STRIP:
                return this.stripMapper(rule, mode, base);
            case decorators.KEY_VALID:
                return this.validMapper(rule);
            case decorators.KEY_INVALID:
                return this.invalidMapper(rule);
            case decorators.KEY_ALLOW:
                return this.allowMapper(rule);
            case decorators.KEY_DESCRIPTION:
                return this.descriptionMapper(rule);
            case decorators.KEY_MIN:
                return this.minMapper(rule, base);
            case decorators.KEY_MAX:
                return this.maxMapper(rule, base);
            case decorators.KEY_LENGTH:
                return this.lengthMapper(rule, base);
            case decorators.KEY_OBJECT_PATTERN:
                return this.objectPatternMapper(rule, unknown);
            case decorators.KEY_REGEX:
                return this.regexMapper(rule);
            /* istanbul ignore next */
            default:
                return Joi.any();
        }
    }

    /**
     * Type mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private typeMapper(rule: PropertyRule, mode: ModeEnum, unknown: boolean): Joi.Schema {
        switch (rule.value) {
            case String:
                return Joi.string();
            case Number:
                return Joi.number();
            case Boolean:
                return Joi.boolean();
            case Object:
                return unknown ? Joi.object().unknown() : Joi.object();
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
            case TypeEnum.ObjectId:
                return Joi.string().regex(this.objectIdRegex);
            case TypeEnum.Integer:
                return Joi.number().integer();
            case TypeEnum.IP:
                return Joi.string().ip();
            case TypeEnum.URI:
                return Joi.string().uri();
            case TypeEnum.Email:
                return Joi.string().email();
            case TypeEnum.Timestamp:
                return Joi.date().timestamp();
            /* istanbul ignore next */
            default:
                if (typeof rule.value === 'function' && new rule.value(null, { strict: false }) instanceof BaseEntity) {
                    return (<BaseEntity>rule.value).schema(mode);
                }
                return Joi.any();
        }
    }

    /**
     * Require mapping
     *
     * @param  {PropertyRule} rule
     * @param  {ModeEnum} mode
     * @returns Joi.Schema
     */
    private requireMapper(rule: PropertyRule, mode: ModeEnum): Joi.Schema {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => Joi.any().required())
            .shift();
    }

    /**
     * Strip mapping
     *
     * @param  {PropertyRule} rule
     * @param  {ModeEnum} mode
     * @returns Joi.Schema
     */
    private stripMapper(rule: PropertyRule, mode: ModeEnum, base: Joi.Schema): Joi.Schema {
        return []
            .concat(rule.value)
            .map(_ => <ModeEnum>_)
            .filter(_ => !!_ && _ === mode)
            .map(_ => Joi.any().strip())
            .shift();
    }

    /**
     * Valid mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private validMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().valid([]
            .concat(rule.value)
            .map(_ => (_ instanceof EntityRef) ? Joi.ref(_.ref) : _));
    }

    /**
     * Invalid mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private invalidMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().invalid([]
            .concat(rule.value)
            .map(_ => (_ instanceof EntityRef) ? Joi.ref(_.ref) : _));
    }

    /**
     * Allow mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private allowMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().allow([]
            .concat(rule.value)
            .map(_ => (_ instanceof EntityRef) ? Joi.ref(_.ref) : _));
    }

    /**
     * Description mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private descriptionMapper(rule: PropertyRule): Joi.Schema {
        return Joi.any().description(rule.value);
    }

    /**
     * Min mapping
     *
     * @param  {PropertyRule} rule
     * @param  {Joi.Schema} base
     * @returns Joi.Schema
     */
    private minMapper(rule: PropertyRule, base: Joi.Schema): Joi.Schema {
        switch (base['_type']) {
            case 'string':
                return Joi.string().min(rule.value);
            case 'number':
                return Joi.number().min(rule.value);
            case 'binary':
                return Joi.binary().min(rule.value);
            case 'array':
                return Joi.array().min(rule.value);
            default:
                return Joi.any();
        }
    }

    /**
     * Max mapping
     *
     * @param  {PropertyRule} rule
     * @param  {Joi.Schema} base
     * @returns Joi.Schema
     */
    private maxMapper(rule: PropertyRule, base: Joi.Schema): Joi.Schema {
        switch (base['_type']) {
            case 'string':
                return Joi.string().max(rule.value);
            case 'number':
                return Joi.number().max(rule.value);
            case 'binary':
                return Joi.binary().max(rule.value);
            case 'array':
                return Joi.array().max(rule.value);
            default:
                return Joi.any();
        }
    }

    /**
     * Length mapping
     *
     * @param  {PropertyRule} rule
     * @param  {Joi.Schema} base
     * @returns Joi.Schema
     */
    private lengthMapper(rule: PropertyRule, base: Joi.Schema): Joi.Schema {
        switch (base['_type']) {
            case 'string':
                return Joi.string().length(rule.value);
            case 'binary':
                return Joi.binary().length(rule.value);
            case 'array':
                return Joi.array().length(rule.value);
            default:
                return Joi.any();
        }
    }

    /**
     * Object Pattern mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private objectPatternMapper(rule: PropertyRule, unknown: boolean): Joi.Schema {
        if (!rule.value.schema) {
            throw new Error('Wrong schema provided');
        } else if (rule.value.schema instanceof BaseEntity) {
            return Joi.object().pattern(rule.value.pattern, rule.value.schema.schema());
        } else {
            return Joi.object().pattern(rule.value.pattern,
                this.typeMapper({ key: null, value: rule.value.schema }, ModeEnum.READ, unknown));
        }
    }

    /**
     * Regex mapping
     *
     * @param  {PropertyRule} rule
     * @returns Joi.Schema
     */
    private regexMapper(rule: PropertyRule): Joi.Schema {
        if (!(rule.value instanceof RegExp)) {
            throw new Error('Wrong regex provided');
        } else {
            return Joi.string().regex(rule.value);
        }
    }
}
