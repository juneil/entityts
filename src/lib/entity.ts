import { PropertyMetadata } from './decorators';
import { KEY_PROPS } from './symbols';
import { ModeEnum, TypeEnum } from './enums';
import { JoiTransformer } from '../transformers/joi.transformer';

export interface EntityOptions {
    strict?: boolean;
    mode?: ModeEnum;
}

export interface EntityTransformer<T> {
    build: (source: PropertyMetadata[], mode: ModeEnum, more?: T, parent?: BaseEntity) => T;
    isValid: (value: BaseEntity, schema: T) => boolean;
    validate: (value: BaseEntity, schema: T) => { value: any, error: Error };
}

export class EntityRef {
    constructor(
        public ref: string
    ) {}
}


export class BaseEntity {

    static Mode = ModeEnum;
    static Type = TypeEnum;

    protected static parent;
    protected static transformers: EntityTransformer<any>[];
    protected static more() {}

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
            .build(Reflect.getMetadata(KEY_PROPS, this), mode, this.more(), this.parent);
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
    constructor(payload = {}, options?: EntityOptions) {
        options = options || { strict: true, mode: ModeEnum.READ };
        payload = payload || {};
        const result = this
            .constructor
            ['transformers'][0]
            .validate(payload, this.constructor['schema'](options.mode));
        if (options.strict !== false && !!result.error) {
            throw result.error;
        }
        []
            .concat(Reflect.getOwnMetadata(KEY_PROPS, this.constructor))
            .filter(_ => !!_)
            .forEach((_: PropertyMetadata) => Reflect.set(this, _.property, result.value[_.property] || undefined))
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

    /**
     * Get schema
     *
     * @param  {ModeEnum} mode
     */
    schema<T>(mode?: ModeEnum): T {
        return this.constructor['schema'](mode);
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
        static more() {};
    }
}

export const Entity = EntityTo(JoiTransformer);

export function EntityExtends(parent: any) {
    const _p = Reflect.construct(parent, [{}, { strict: false }]);
    return class extends BaseEntity {
        static transformers = [new JoiTransformer()];
        static parent = (_p instanceof BaseEntity) ? parent : undefined;
        static more() {};
    }
}
