'use strict';

const { PERM_FLAGS, KEY_PERMS } = require('../config');

module.exports = class Permissions {
    constructor(perms) {
        this.perms = perms;
    }

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

    formatToReadable() {
        let _ = new Set();

        for (const p of this.perms) {

            _.add(PERM_FLAGS[p]);
        }

        return Array.from(_).join(', ');
    }
};