'use strict';

/*
    Custom Error class
*/
module.exports = class Err {
    constructor(httpStatus, name, message) {
        this.name = name ?? 'Unknown';
        this.message = message ?? 'Unknown';
        this.httpStatus = httpStatus ?? 500;
    }

    inputErr() {
        this.name = 'Input Error';
        return this;
    }

    memberNotFound() {
        this.message = 'Member not found';
        return this;
    }
};