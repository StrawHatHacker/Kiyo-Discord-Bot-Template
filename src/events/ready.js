'use strict';

const DateFormatter = require('../utils/DateFormatter');

module.exports = (client) => console.log(`🤖 ${client.user.username} connected at ${new DateFormatter(new Date()).formatToReadable()} (${process.env.ENVIRONMENT})`);
