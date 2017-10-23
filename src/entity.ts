import { PropertyMetadata } from './decorators';
import { KEY_PROPS } from './symbols';
import { ModeEnum, TypeEnum } from './enums';
import { JoiBuilder } from './joi';


export abstract class Entity {

    static Mode = ModeEnum;
    static Type = TypeEnum;

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

    static schema(mode: ModeEnum = ModeEnum.READ) {
        return JoiBuilder.build(Reflect.getMetadata(KEY_PROPS, this), mode);
    }

    isValid(mode: ModeEnum = ModeEnum.READ): boolean {
        return JoiBuilder.isValid(this, JoiBuilder.build(Reflect.getOwnMetadata(KEY_PROPS, this.constructor), mode));
    }
   
}
