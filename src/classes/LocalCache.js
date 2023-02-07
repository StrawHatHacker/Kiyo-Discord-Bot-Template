'use strict';

class LocalCache {
    constructor(ttl = 10_000, interval = 5_000) {
        this.data = new Map();
        this.ttl = ttl;
        this.interval = interval;

        this.interval = this.interval === 0 ? null : setInterval(async () => {
            const epochNow = new Date().getTime();

            for (const [key, val] of this.data) {
                if (epochNow - val.lastAccessed > this.ttl) {
                    this.data.delete(key);
                }
            }
        }, this.interval);
    }

    /**
     * @description Returns a copy of the object
     * @param {string | number} key 
     */
    get(key) {
        const found = this.data.get(key);
        if (found) {
            console.log('Found guild: ', key);

            found.lastAccessed = new Date().getTime();
            return found;
        }

        return;
    }

    /**
     * @param {string | number} key 
     * @param {object} value 
     */
    set(key, value) {
        console.log('Set guild: ', key);

        value.lastAccessed = new Date().getTime();
        this.data.set(key, value);
    }

    delete(key) {
        return this.data.delete(key);
    }
}

module.exports = LocalCache;