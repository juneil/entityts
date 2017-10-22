import 'reflect-metadata';
import { KEY_PROPS, KEY_TYPE, KEY_REQUIRED } from './symbols';
import { TypeEnum } from './enums';

type PropertyType = String | Number | Object | Boolean | Buffer | TypeEnum;
type DecoratorFunc = (target: Object, propertyName: string) => void;

export interface PropertyMetadata {
    property: string;
    rules: [ PropertyRule ];
}

interface PropertyRule {
    key: symbol;
    value: any;
}

/**
 * Decorator @Type()
 * Determine the property type
 * for validation
 *
 * @param  {PropertyType|Array<PropertyType>} type
 * @returns DecoratorFunc
 */
export function Type(type: PropertyType | Array<PropertyType>): DecoratorFunc {
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
 * @returns DecoratorFunc
 */
export function Required(): DecoratorFunc {
    return function (target: Object, propertyName: string) {
        insertRule(target.constructor, propertyName, {
            key: KEY_REQUIRED,
            value: null
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
