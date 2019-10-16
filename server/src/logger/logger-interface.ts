export interface LoggerInterface {
    emerg(message: string, meta: any);

    alert(message: string, meta: any);

    crit(message: string, meta: any);

    error(message: string, meta: any);

    warning(message: string, meta: any);

    notice(message: string, meta: any);

    info(message: string, meta: any);

    debug(message: string, meta: any);
}
