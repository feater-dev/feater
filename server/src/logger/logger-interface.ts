export interface LoggerInterface {
    emerg(message: string, meta: object);

    alert(message: string, meta: object);

    crit(message: string, meta: object);

    error(message: string, meta: object);

    warning(message: string, meta: object);

    notice(message: string, meta: object);

    info(message: string, meta: object);

    debug(message: string, meta: object);
}
