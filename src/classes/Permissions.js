'use strict';

const { PERM_FLAGS, KEY_PERMS } = require('../config');

/*
    Permissions class for filtering and formatting Discord permissions
*/
module.exports = class Permissions {
    constructor(perms) {
        this.perms = perms;
    }

    // Returns an array of the MOST important permissions. See KEY_PERMS in config
    // NOTE: filterKeyPerms & filterNonKeyPerms are mutually exclusive
    filterKeyPerms() {
        let _ = new Set();

        for (const p of this.perms) {
            if (p === 'ADMINISTRATOR') {
                this.perms = ['ADMINISTRATOR'];
                return this;
            }
            KEY_PERMS.includes(p) && _.add(p);
        }

        this.perms = Array.from(_);
        return this;
    }

    // Returns an array of the NON important permissions. See KEY_PERMS in config
    // NOTE: filterKeyPerms & filterNonKeyPerms are mutually exclusive
    filterNonKeyPerms() {
        let _ = new Set();

        for (const p of this.perms) {
            if (p === 'ADMINISTRATOR') {
                this.perms = ['ADMINISTRATOR'];
                return this;
            }
            !KEY_PERMS.includes(p) && _.add(p);
        }

        this.perms = Array.from(_);
        return this;
    }

    // Helper method to convert discord Permissions Collection to an array ['ADMINISTRATOR', 'BAN_MEMBERS', ...]
    permsToArray() {
        this.perms = Array.from(this.perms);
        return this;
    }

    // User has to have ANY one of the reqPerms to execute the command
    userhasPermission(reqPerms) {
        if (reqPerms.length === 0) return true;

        for (const p of this.perms) {
            if (reqPerms.includes(p) || p === 'ADMINISTRATOR') return true;
        }
        return false;
    }

    // Client has to have ALL one of the reqPerms to execute the command
    clientHasPermission(reqPerms) {
        if (reqPerms.length === 0) return true;

        for (const p of reqPerms) {
            if (!this.perms.includes(p)) return false;
        }
        return true;
    }

    // Returns a "human readable" string of Permission Flags
    formatToReadable() {
        let _ = new Set();

        for (const p of this.perms) _.add(PERM_FLAGS[p]);

        return Array.from(_).join(', ');
    }

    formatToReadableCode() {
        let _ = new Set();

        for (const p of this.perms) _.add(`\`${PERM_FLAGS[p]}\``);

        return Array.from(_).join(', ');
    }
};
