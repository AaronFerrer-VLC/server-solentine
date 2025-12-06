/**
 * Logger Estructurado
 * 
 * Proporciona logging estructurado con niveles y contexto
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Niveles de log
 */
const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};

/**
 * Logger estructurado
 */
class Logger {
    constructor(context = 'App') {
        this.context = context;
    }

    /**
     * Formatea el mensaje de log
     */
    format(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            context: this.context,
            message,
            ...meta
        };

        if (isDevelopment) {
            // En desarrollo, formato más legible
            const emoji = {
                error: '❌',
                warn: '⚠️',
                info: 'ℹ️',
                debug: '🔍'
            }[level] || '📝';

            console.log(`${emoji} [${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, meta);
        } else {
            // En producción, JSON estructurado
            console.log(JSON.stringify(logEntry));
        }

        return logEntry;
    }

    /**
     * Log de error
     */
    error(message, error = null, meta = {}) {
        const logMeta = {
            ...meta,
            ...(error && {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: isDevelopment ? error.stack : undefined
                }
            })
        };
        return this.format(LOG_LEVELS.ERROR, message, logMeta);
    }

    /**
     * Log de advertencia
     */
    warn(message, meta = {}) {
        return this.format(LOG_LEVELS.WARN, message, meta);
    }

    /**
     * Log de información
     */
    info(message, meta = {}) {
        return this.format(LOG_LEVELS.INFO, message, meta);
    }

    /**
     * Log de debug (solo en desarrollo)
     */
    debug(message, meta = {}) {
        if (isDevelopment) {
            return this.format(LOG_LEVELS.DEBUG, message, meta);
        }
    }

    /**
     * Crea un logger con un contexto específico
     */
    child(context) {
        return new Logger(`${this.context}:${context}`);
    }
}

// Logger por defecto
const defaultLogger = new Logger('App');

module.exports = {
    Logger,
    defaultLogger,
    LOG_LEVELS
};

