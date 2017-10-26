import { PropertyMetadata } from './decorators';
import { KEY_PROPS } from './symbols';
import { ModeEnum, TypeEnum } from './enums';
import { JoiTransformer } from '../transformers/joi.transformer';


export interface EntityTransformer<T> {
    build: (source: PropertyMetadata[], mode: ModeEnum) => T;
    isValid: (value: BaseEntity, schema: T) => boolean;
}

export class EntityRef {
    constructor(
        public ref: string
    ) {}
}


export class BaseEntity {

    static Mode = ModeEnum;
    static Type = TypeEnum;

    protected static transformers: EntityTransformer<any>[];

    /**
     * Get schema
     * @todo Implement the transformers system
     * @param  {ModeEnum=ModeEnum.READ} mode
     * @returns T
     */
    static schema<T>(mode: ModeEnum = ModeEnum.READ): T {
        if (!(this.transformers && this.transformers.length > 0)) {
            return;
        }
        return this
            .transformers[0]
            .build(Reflect.getMetadata(KEY_PROPS, this), mode);
    }

    /**
     * Do a reference to another property
     *
     * @param  {string} ref
     * @returns EntityRef
     */
    static ref(ref: string): EntityRef {
        return new EntityRef(ref);
    }

    /**
     * Try to populate the Entity with
     * a provided payload
     *
     * @constructor
     * @param  {} payload={}
     */
    constructor(payload = {}) {
        []
            .concat(Reflect.getOwnMetadata(KEY_PROPS, this.constructor))
            .filter(_ => !!_)
            .forEach((_: PropertyMetadata) => Reflect.set(this, _.property, payload[_.property] || undefined))
    }

    /**
     * Check if the entity instance is valid
     *
     * @param  {ModeEnum=ModeEnum.READ} mode
     * @returns boolean
     */
    isValid(mode: ModeEnum = ModeEnum.READ): boolean {
        return this
            .constructor
            ['transformers'][0]
            .isValid(this, this.constructor['schema'](mode));
    }
}

export type Constructor<T> = new(...args: any[]) => T;

/**
 * Mixin to link Tranformers
 *
 * @param  {Constructor<Object>[]} ...transformers
 */
export function EntityTo(...transformers: Constructor<Object>[]) {
    return class extends BaseEntity {
        static transformers = <EntityTransformer<any>[]>transformers.map(Transformer => new Transformer());
    }
}

export const Entity = EntityTo(JoiTransformer);
