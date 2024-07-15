import * as process from 'node:process';

import { isString } from '@dronisosTelemetry/utils/assertion';

export enum LoggerLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

class Logger {
    public readonly level: LoggerLevel = LoggerLevel.ERROR;

    public constructor() {
        if (isString(process.env.LOG_LEVEL) && Object.values(LoggerLevel).includes(process.env.LOG_LEVEL)) {
            this.level = process.env.LOG_LEVEL as unknown as LoggerLevel;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug(...args: any[]): void {
        if (this.level >= LoggerLevel.DEBUG) {
            console.debug(this.timestamp(), 'LOG -', ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(...args: any[]): void {
        if (this.level >= LoggerLevel.ERROR) {
            console.error(this.timestamp(), 'ERROR -', ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public fatal(...args: any[]): void {
        if (this.level >= LoggerLevel.FATAL) {
            console.error(this.timestamp(), 'FATAL -', ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public info(...args: any[]): void {
        if (this.level >= LoggerLevel.INFO) {
            console.info(this.timestamp(), 'LOG -', ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public log(...args: any[]): void {
        if (this.level >= LoggerLevel.INFO) {
            console.log(this.timestamp(), 'LOG -', ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public warn(...args: any[]): void {
        if (this.level >= LoggerLevel.WARN) {
            console.warn(this.timestamp(), 'WARN -', ...args);
        }
    }

    private timestamp(): string {
        return `[${new Date().toISOString()}]`;
    }
}

export const logger = new Logger();
