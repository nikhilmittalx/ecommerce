// if we didnt give a name which is required:true, then it keeps on sending the request for infinity

// try catch
module.exports = theFunc => (req, res, next) => {
    Promise
        .resolve(theFunc(req, res, next))
        .catch(next);
}