import 'reflect-metadata';
import { TypeEnum, ModeEnum } from './enums';
import { KEY_PROPS, decorators } from './symbols';
import { BaseEntity } from './entity';

export type PropertyType = String | Number | Date | Object | Boolean | Buffer | TypeEnum;
export type DecoratorFunc = (target: Object, propertyName: string) => void;

export interface PropertyMetadata {
    property: string;
    rules: [ PropertyRule ];
}

export interface PropertyRule {
    key: symbol;
    value: any;
}

/**
 * Decorator @Type()
 * Determine the property type
 * for validation
 *
 * @param  {PropertyType} type
 * @returns DecoratorFunc
 */
export function Type(type: PropertyType): DecoratorFunc {
    return insertRule({ key: decorators.KEY_TYPE, value: type });
}

/**
 * Decorator @Array()
 * Determine the property type
 * for validation
 *
 * @param  {PropertyType} type
 * @returns DecoratorFunc
 */
export function Array(type: PropertyType): DecoratorFunc {
    return insertRule({ key: decorators.KEY_ARRAY, value: type });
}

/**
 * Decorator @Required()
 * Set the requirement of the property
 *
 * @param  {ModeEnum[]} mode
 * @returns DecoratorFunc
 */
export function Required(...mode: ModeEnum[]): DecoratorFunc {
    mode = !mode.length ? [ ModeEnum.READ ] : mode;
    return insertRule({ key: decorators.KEY_REQUIRED, value: mode });
}

/**
 * Decorator @Strip()
 * Determine if the property
 * should be removed
 *
 * @param  {ModeEnum[]} mode
 * @returns DecoratorFunc
 */
export function Strip(...mode: ModeEnum[]): DecoratorFunc {
    mode = !mode.length ? [ ModeEnum.READ ] : mode;
    return insertRule({ key: decorators.KEY_STRIP, value: mode });
}

/**
 * Decorator @Valid()
 * Determine the values
 * allowed
 *
 * @param  {any[]} value
 * @returns DecoratorFunc
 */
export function Valid(...value: any[]): DecoratorFunc {
    return insertRule({ key: decorators.KEY_VALID, value });
}

/**
 * Decorator @Invalid()
 * Determine the values
 * only allowed
 *
 * @param  {any[]} value
 * @returns DecoratorFunc
 */
export function Invalid(...value: any[]): DecoratorFunc {
    return insertRule({ key: decorators.KEY_INVALID, value });
}

/**
 * Decorator @Allow()
 * Determine the values
 * allowed
 *
 * @param  {any[]} value
 * @returns DecoratorFunc
 */
export function Allow(...value: any[]): DecoratorFunc {
    return insertRule({ key: decorators.KEY_ALLOW, value });
}

/**
 * Decorator @Description()
 * Describe the property
 *
 * @param  {string} description
 * @returns DecoratorFunc
 */
export function Description(description: string): DecoratorFunc {
    return insertRule({ key: decorators.KEY_DESCRIPTION, value: description });
}

/**
 * Decorator @Min()
 * Set a min validation
 *
 * @param  {number} value
 * @returns DecoratorFunc
 */
export function Min(value: number): DecoratorFunc {
    return insertRule({ key: decorators.KEY_MIN, value });
}

/**
 * Decorator @Max()
 * Set a max validation
 *
 * @param  {number} value
 * @returns DecoratorFunc
 */
export function Max(value: number): DecoratorFunc {
    return insertRule({ key: decorators.KEY_MAX, value });
}

/**
 * Decorator @Length()
 * Set a length validation
 *
 * @param  {number} value
 * @returns DecoratorFunc
 */
export function Length(value: number): DecoratorFunc {
    return insertRule({ key: decorators.KEY_LENGTH, value });
}

/**
 * Decorator @ObjectPattern()
 *
 * @param  {RegExp} pattern
 * @param  {PropertyType} schema
 * @returns DecoratorFunc
 */
export function ObjectPattern(pattern: RegExp, schema: PropertyType): DecoratorFunc {
    return insertRule({ key: decorators.KEY_OBJECT_PATTERN, value: { pattern, schema }});
}

/**
 * Decorator @Regex()
 *
 * @param  {RegExp} pattern
 * @returns DecoratorFunc
 */
export function Regex(pattern: RegExp): DecoratorFunc {
    return insertRule({ key: decorators.KEY_REGEX, value: pattern });
}

/**
 * Insert a new rule of a property
 * in the metadata of the Entity
 *
 * @param  {Function} target
 * @param  {string} propertyName
 * @param  {PropertyRule} rule
 * @returns void
 */
function insertRule(rule: PropertyRule): DecoratorFunc {
    return function (target: Object, propertyName: string) {
        if (!(target instanceof BaseEntity)) {
            return;
        }
        Reflect
            .defineMetadata(
                KEY_PROPS,
                getPropertiesWithInit(target.constructor, propertyName)
                    .map(_ => ({
                        property: _.property,
                        rules: _.property === propertyName ? _.rules.concat(rule) : _.rules
                    })),
                target.constructor
            );
    };
}

/**
 * Get properties from metadata
 * and initialize property if does
 * not already exist
 *
 * @param  {Function} target
 * @param  {string} propertyName
 * @returns PropertyMetadata
 */
function getPropertiesWithInit(target: Function, propertyName: string): PropertyMetadata[] {
    const props = <PropertyMetadata[]>[]
        .concat(Reflect.getOwnMetadata(KEY_PROPS, target))
        .filter(_ => !!_);
    if (!props.find(_ => _.property === propertyName)) {
        return props.concat(<PropertyMetadata>{ property: propertyName, rules: <PropertyRule[]>[] });
    }
    return props;
}
