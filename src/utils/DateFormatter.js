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

    formatDayOfMonthToReadable(number) {
        if (isNaN(Number(number))) throw new Error('You didn\'t pass a valid number');
        if (number === 1) return '1st';
        if (number === 21) return '21st';
        if (number === 31) return '31st';
        if (number === 2) return '2nd';
        if (number === 22) return '22nd';
        if (number === 3) return '3rd';
        if (number === 23) return '23rd';

        return `${number}th`;
    }

    // Return example: `5th of November 2003`
    formatToReadable() {
        const _ = this.date;
        return `${this.formatDayOfMonthToReadable(_.getDate())} of ${MONTHS[_.getMonth()]} ${_.getFullYear()}`;
    }
};
