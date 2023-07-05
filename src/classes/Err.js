'use strict';

/*
    Custom Error class
*/
module.exports = class Err {
    /**
     * 
     * @param {number} httpStatus 
     * @param {string} name 
     * @param {string} message 
     */
    constructor(httpStatus, name, message) {
        this.name = name ?? 'Unknown';
        this.message = message ?? 'Unknown';
        this.httpStatus = httpStatus ?? 500;
    }

    /**
     * @param {number} code
    */
    setStatusCode(code) {
        this.httpStatus = code;
        return this;
    }

    /**
     * @param {string} code
    */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
    * @param {string} code
    */
    setMessage(message) {
        this.message = message;
        return this;
    }

    badRequest() {
        this.httpStatus = 400;
        return this;
    }

    unauthorized() {
        this.httpStatus = 401;
        return this;
    }

    notFound() {
        this.httpStatus = 404;
        return this;
    }

    /**
    * @description User syntax error
    */
    syntaxErr() {
        this.name = 'Syntax Error';
        return this;
    }

    /**
    * @description When they know what they have to input but they do it wrong
    */
    inputErr() {
        this.name = 'Input Error';
        return this;
    }

    /**
    * @description Any error
    */
    otherErr() {
        this.name = 'Error';
        return this;
    }

    /**
    * @description User was not fast enough
    */
    timeErr() {
        this.name = 'Timed Out';
        return this;
    }

    /**
    * @description Member was not found in the guild
    */
    memberNotFound() {
        this.httpStatus = 404;
        this.message = 'Member not found';
        return this;
    }

    /**
    * @description User not found in user cache or guild
    */
    userNotFound() {
        this.httpStatus = 404;
        this.message = 'User not found';
        return this;
    }

    /**
    * @description Channel not found in the guild
    */
    channelNotFound() {
        this.httpStatus = 404;
        this.message = 'Channel not found';
        return this;
    }

    /**
    * @description User was not found after API user fetch request
    */
    userNotExists() {
        this.httpStatus = 404;
        this.message = 'User no longer exists';
        return this;
    }

    /**
    * @description Role not found in the guild
    */
    roleNotFound() {
        this.httpStatus = 404;
        this.message = 'Role not found';
        return this;
    }

    /**
    * @description The role already exists
    * @param {string} appendable
    */
    roleAlreadyExists(appendable) {
        this.httpStatus = 400;
        this.message = 'Role already exists ' + appendable;
        return this;
    }

    /**
    * @description The channel already exists
    * @param {string} appendable
    */
    channelAlreadyExists(appendable) {
        this.httpStatus = 400;
        this.message = 'Channel already exists ' + appendable;
        return this;
    }

    /**
    * @description Input was not a number
    * @param {string} whatIsNotANumber
    */
    notANumber(whatIsNotANumber) {
        this.httpStatus = 400;
        this.message = whatIsNotANumber + ' is not a number';
        return this;
    }

    /**
    * @description Number input is was not a positive number
    * @param {string} whatIsNotPositive
    */
    notPositive(whatIsNotPositive) {
        this.httpStatus = 400;
        this.message = whatIsNotPositive + ' should be greater than zero';
        return this;
    }

    jsonNotValid() {
        this.message = 'JSON not valid';
        return this;
    }
};
