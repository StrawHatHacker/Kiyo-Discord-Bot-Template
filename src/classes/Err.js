'use strict';

/*
    Custom Error class
*/
module.exports = class Err {
    constructor(e, name, message) {
        this.name = name ?? 'Unknown';
        this.message = message ?? 'Unknown';
        this.httpStatus = e.httpStatus ?? 500;
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