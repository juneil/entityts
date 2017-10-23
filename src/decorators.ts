import 'reflect-metadata';
import { KEY_PROPS, KEY_TYPE, KEY_REQUIRED, KEY_STRIP } from './symbols';
import { TypeEnum, ModeEnum } from './enums';

type PropertyType = String | Number | Object | Boolean | Buffer | TypeEnum;
type DecoratorFunc = (target: Object, propertyName: string) => void;

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
 * @param  {PropertyType|PropertyType[]} type
 * @returns DecoratorFunc
 */
export function Type(type: PropertyType | PropertyType[]): DecoratorFunc {
    return function (target: Object, propertyName: string) {
        insertRule(target.constructor, propertyName, {
            key: KEY_TYPE,
            value: type
        })
    }
}

/**
 * Decorator @Required()
 * Set the requirement of the property
 *
 * @param  {ModeEnum|ModeEnum[]} mode
 * @returns DecoratorFunc
 */
export function Required(mode?: ModeEnum | ModeEnum[]): DecoratorFunc {
    return function (target: Object, propertyName: string) {
        insertRule(target.constructor, propertyName, {
            key: KEY_REQUIRED,
            value: mode
        })
    }
}

/**
 * Decorator @Strip()
 * Determine if the property
 * should be removed
 *
 * @param  {ModeEnum|ModeEnum[]} mode
 * @returns DecoratorFunc
 */
export function Strip(mode?: ModeEnum | ModeEnum[]): DecoratorFunc {
    return function (target: Object, propertyName: string) {
        insertRule(target.constructor, propertyName, {
            key: KEY_STRIP,
            value: mode
        })
    }
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
function insertRule(target: Function, propertyName: string, rule: PropertyRule): void {
    Reflect
        .defineMetadata(
            KEY_PROPS,
            getPropertiesWithInit(target, propertyName)
                .map(_ => ({
                    property: _.property,
                    rules: _.property === propertyName ? _.rules.concat(rule) : _.rules
                })),
            target
        );
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
        return props.concat(<PropertyMetadata>{ property: propertyName, rules: [] }) 
    }
    return props;
}
