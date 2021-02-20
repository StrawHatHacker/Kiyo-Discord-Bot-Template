const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December']

module.exports = class DateFormatter {
    constructor(date) {
        if (!(date instanceof Date)) throw new Error('You didn\'t pass a valid date');
        this.date = date;
    };

    formatDayOfMonthToReadable(number) {
        if (isNaN(Number(number))) throw new Error('You didn\'t pass a valid number');
        if (number === 1) return '1st';
        if (number === 2) return '2nd';
        if (number === 3) return '3rd';

        return `${number}th`;
    };

    formatToReadable() {
        const _ = this.date;
        return `${this.formatDayOfMonthToReadable(_.getDate())} of ${MONTHS[_.getMonth()]} ${_.getFullYear()}`;
    };
};