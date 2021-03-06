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

    // Returns a "human readable" string of Permission Flags
    formatToReadable() {
        let _ = new Set();

        for (const p of this.perms) _.add(PERM_FLAGS[p]);

        return Array.from(_).join(', ');
    }
};