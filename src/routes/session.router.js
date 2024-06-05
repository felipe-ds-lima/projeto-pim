const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const jwt = require('jsonwebtoken')

const router = Router()

router.post('/', (req, res) => {
    const { email, password } = req.body

    DBConnection.db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
        if (err || !results[0]) {
            return res.status(401).json({ message: 'E-mail or password incorrect.' });
        }
        if (password !== results[0].password) {
            return res.status(401).json({ message: 'E-mail or password incorrect.' });
        }

        console.log(results)

        const payload = { name: results[0].name, email: results[0].email, userId: results[0].userId }

        const token = jwt.sign(payload, 'facilitimesecretkey', { expiresIn: '1d' })

        return res.json({ token });
    })
})

module.exports = router