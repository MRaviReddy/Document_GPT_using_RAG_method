import logging
import logging.handlers
import logging.config

LOGGING_CONFIG_CONSOLE = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '[%(asctime)s] %(levelname)s %(name)s %(funcName)s %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "console",
        },
    },
    "loggers": {
        "": {
            "level": "INFO",
            "handlers": ["console"],
            "propagate": True
        },
    }
}

def create_logger(name):
    logging.config.dictConfig(LOGGING_CONFIG_CONSOLE)
    return logging.getLogger(name)
