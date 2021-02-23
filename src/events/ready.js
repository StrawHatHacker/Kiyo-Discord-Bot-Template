'use strict';

const DateFormatter = require('../utils/DateFormatter');

module.exports = (Kiyo) => console.log(`${Kiyo.user.username} connected at ${new DateFormatter(new Date()).formatToReadable()}`);