export enum ModeEnum {
    READ            = <any>Symbol('mode_read'),
    CREATE          = <any>Symbol('mode_create'),
    UPDATE          = <any>Symbol('mode_update')
}

export enum TypeEnum {
    Any             = <any>Symbol('type_any'),
    ObjectId        = <any>Symbol('type_objectid'),
    Hex             = <any>Symbol('type_hex'),
    Base64          = <any>Symbol('type_base64')
}
