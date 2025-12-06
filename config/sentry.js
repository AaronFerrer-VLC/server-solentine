/**
 * Sentry Configuration
 * 
 * Error tracking y monitoring en producción
 */

const Sentry = require('@sentry/node');

/**
 * Inicializa Sentry
 */
function initSentry() {
    const dsn = process.env.SENTRY_DSN;
    
    if (!dsn) {
        console.warn('⚠️  SENTRY_DSN no configurada - Error tracking deshabilitado');
        return;
    }

    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        beforeSend(event, hint) {
            // Filtrar información sensible
            if (event.request) {
                // No enviar body completo si contiene passwords
                if (event.request.data) {
                    const data = event.request.data;
                    if (data.password) {
                        event.request.data = { ...data, password: '[REDACTED]' };
                    }
                    if (data.token) {
                        event.request.data = { ...data, token: '[REDACTED]' };
                    }
                }
            }
            return event;
        }
    });

    console.log('✅ Sentry inicializado');
}

/**
 * Captura una excepción en Sentry
 */
function captureException(error, context = {}) {
    if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
            Object.keys(context).forEach(key => {
                scope.setContext(key, context[key]);
            });
            Sentry.captureException(error);
        });
    }
}

/**
 * Captura un mensaje en Sentry
 */
function captureMessage(message, level = 'info', context = {}) {
    if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
            Object.keys(context).forEach(key => {
                scope.setContext(key, context[key]);
            });
            Sentry.captureMessage(message, level);
        });
    }
}

module.exports = {
    initSentry,
    captureException,
    captureMessage,
    Sentry
};

