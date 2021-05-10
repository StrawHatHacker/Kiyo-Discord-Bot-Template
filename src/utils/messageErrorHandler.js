module.exports = (e, m) => {
    // 404 Not Found
    if (e.httpStatus === 404 || e.httpStatus === 401) m.channel.send(`${e.name}: ${e.message}`);

    // 403 Missing Permissions
    // BE CAREFUL, you might not see errors in your console because of this line
    // usually triggers when the bot doesn't have permissions to do something
    else if (e.httpStatus === 403) return;

    // All other errors
    else {
        console.log(e);
        m.channel.send('Unknown Error');
    }
};
