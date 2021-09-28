'use strict';

const dayjs = require('dayjs');

// Didn't feel like calling it `Time`
module.exports = class TimeParser {
    /**
    * Parses an array of strings into a Time object.
    * An array entry should be of format number:D|H|M, or matched to /(\d+)(D|H|M)/gi
    * @param {String[]} time
    */
    constructor(time) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;

        time.forEach(entry => {
            const split = entry.split('');
            const intentifier = split[split.length - 1];
            const num = entry.slice(0, -1);

            switch (intentifier.toUpperCase()) {
                case 'D': this.days = num; break;
                case 'H': this.hours = num; break;
                case 'M': this.minutes = num; break;
            }
        });
    }

    /**
     * Add this.minutes, this.hours, this.days to the current time and return it.
     * @returns {Date}
    */
    getDateThen() {
        let then = dayjs();

        if (this.minutes) then = then.add(this.minutes, 'minutes');
        if (this.hours) then = then.add(this.hours, 'hours');
        if (this.days) then = then.add(this.days, 'days');

        return new Date(then);
    }

    /**
     * @returns {String}
    */
    toReadable() {
        let str = '';

        if (this.days > 0) str += `${this.days} Day(s) `;
        if (this.hours > 0) str += `${this.hours} Hour(s) `;
        if (this.minutes > 0) str += `${this.minutes} Minute(s) `;

        return str;
    }
};
