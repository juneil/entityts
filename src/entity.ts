import { PropertyMetadata } from './decorators';
import { KEY_PROPS } from './symbols';


export abstract class Entity {

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


}
