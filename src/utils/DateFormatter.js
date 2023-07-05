'use strict';

const { MONTHS } = require('../config');

/*
    Utility class for beautifying dates
*/
module.exports = class DateFormatter {
    /**
     * @param {Date} date 
     */
    constructor(date) {
        if (!(date instanceof Date)) throw new Error('You didn\'t pass a valid date');
        this.date = date;
    }

    /**
     * @param {number} dayNum
     */
    formatDayOfMonthToReadable(dayNum) {
        if (dayNum === 1) return '1st';
        if (dayNum === 21) return '21st';
        if (dayNum === 31) return '31st';
        if (dayNum === 2) return '2nd';
        if (dayNum === 22) return '22nd';
        if (dayNum === 3) return '3rd';
        if (dayNum === 23) return '23rd';

        return `${dayNum}th`;
    }

    /**
     * @description Return example: "5th of November 2003"
     * @returns {string}
     */
    formatToReadable() {
        const _ = this.date;
        return `${this.formatDayOfMonthToReadable(_.getDate())} of ${MONTHS[_.getMonth()]} ${_.getFullYear()}`;
    }
};
