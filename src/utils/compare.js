module.exports = function (objA, objB, props) {
    const diff = {};

    props.forEach(prop => {
        if (objA[prop] !== objB[prop]) {
            diff[prop] = {
                from: objA[prop],
                to: objB[prop]
            };
        }
    });

    return diff;
};
