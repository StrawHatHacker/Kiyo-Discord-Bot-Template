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

    setName(name) {
        this.name = name;
        return this;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    inputErr() {
        this.name = 'Input Error';
        return this;
    }

    timeErr() {
        this.name = 'Timed Out';
        return this;
    }

    syntaxErr() {
        this.name = 'Syntax Error';
        return this;
    }

    memberNotFound() {
        this.message = 'Member not found';
        return this;
    }

    jsonNotValid() {
        this.message = 'JSON not valid';
        return this;
    }

    timedOut() {
        this.message = 'User took too long to respond';
        return this;
    }
};
