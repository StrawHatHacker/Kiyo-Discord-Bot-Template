'use strict';

/**
 * Get the amount of pages you need to display all(total) elements if you have a set number 
 * of elements per page(elementsPerPage). 
 * @param {Number} total 
 * @param {Number} elementsPerPage 
 * @returns {Number}
 */
module.exports = (total, elementsPerPage) => {
    let pageNum = 0;

    for (let i = 0; i < total; i += elementsPerPage) {
        pageNum += 1;
    }

    return pageNum;
};