const logger = (req, res, next) => { // Must pass it on to next middleware unless you're terminating the whole cycle by sending back the response like we're sending 'Testing' here otherwise browser won't stop loading
    const method = req.method;
    const url = req.url;
    const time = new Date().getFullYear();
    console.log(method, url, time);
    // res.send('Testing');
    next();
}

module.exports = logger;