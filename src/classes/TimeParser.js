'use strict';

const msInADay = 86400000;
const msInAnHour = 3600000;
const msInAMinute = 60000;
const msInASecond = 1000;

module.exports = class TimeParser {
    /**
    * @description Calculates days, hours, minutes and seconds from a given time(in ms)
    * @param {Number} time
    */
    constructor(ms) {
        this.ms = ms;
        this.msLeft = ms;

        this.days = Math.floor(this.msLeft / msInADay);
        this.msLeft = this.msLeft % msInADay;

        this.hours = Math.floor(this.msLeft / msInAnHour);
        this.msLeft = this.msLeft % msInAnHour;

        this.minutes = Math.floor(this.msLeft / msInAMinute);
        this.msLeft = this.msLeft % msInAMinute;

        this.seconds = Math.floor(this.msLeft / msInASecond);
        this.msLeft = this.msLeft % msInASecond;

        // For debugging
        // console.log(`${this.days} days, ${this.hours} hours, ${this.minutes} minutes, ${this.seconds} seconds, ${this.msLeft} ms left, ${ms} ms`);
    }

    /**
     * @description Finds the date that is "this.ms" ms from now
     * @returns {Date | null}  
    */
    getTimeThen() {
        if (this.ms === 0) return null;
        return new Date(new Date().setMilliseconds(new Date().getMilliseconds() + this.ms));
    }

    /**
     * @description Beautifies the time
     * @returns {String}
    */
    toReadable() {
        let str = '';

        if (this.days > 0) str += `${this.days} Day(s) `;
        if (this.hours > 0) str += `${this.hours} Hour(s) `;
        if (this.minutes > 0) str += `${this.minutes} Minute(s) `;
        if (this.seconds > 0) str += `${this.seconds} Second(s) `;

        return str;
    }
};
