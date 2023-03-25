import winston from 'winston';

const formatLog = winston.format.printf((info) => {
    return `${info['timestamp']} [${info['level'].toUpperCase()}] ${info['message']}`;
});

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.combine(winston.format.timestamp(), formatLog),
    transports: [new winston.transports.Console({ level: process.env['LOG_LEVEL'] || 'info' })]
});


export default logger;