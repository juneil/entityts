export enum ModeEnum {
    READ            = 'mode_read',
    CREATE          = 'mode_create',
    UPDATE          = 'mode_update'
}

export enum TypeEnum {
    Any             = <any>Symbol('type_any'),
    ObjectId        = <any>Symbol('type_objectid'),
    Hex             = <any>Symbol('type_hex'),
    Base64          = <any>Symbol('type_base64'),
    IsoDate         = <any>Symbol('type_isodate'),
    Integer         = <any>Symbol('type_integer'),
    IP              = <any>Symbol('type_ip'),
    URI             = <any>Symbol('type_uri')
}
