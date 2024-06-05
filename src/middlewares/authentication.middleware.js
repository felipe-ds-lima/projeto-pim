const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ message: 'Invalid token.' })
    }
    const [, token] = authorization.split(' ')
    if (!token) {
        return res.status(401).json({ message: 'Invalid token.' })
    }

    try {
        jwt.verify(token, 'facilitimesecretkey')

        const decoded = jwt.decode(token)

        req.user = decoded;

        next()
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token.' })
    }

}