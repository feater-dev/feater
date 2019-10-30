export interface LoggerInterface {
    emerg(message: string, meta: unknown);

    alert(message: string, meta: unknown);

    crit(message: string, meta: unknown);

    error(message: string, meta: unknown);

    warning(message: string, meta: unknown);

    notice(message: string, meta: unknown);

    info(message: string, meta: unknown);

    debug(message: string, meta: unknown);
}
