declare global {
	interface Array<T> {
		/**
		 * @description Limit the length of an array, the correct way
		 */
		limit(limit: number): Array<T>;
		/**
		 * @description Remove element from array. The opposite of [].push
		 */
		pull(element: T): Array<T>;
	}
}

Array.prototype.limit = function (limit: number) {
    return this.slice(0, limit);
};

Array.prototype.pull = function (val) {
    if (!val) return this;

    return this.filter((e) => e !== val);
};

export {};
