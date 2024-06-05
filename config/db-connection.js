const mysql = require('mysql2')

class DBConnection {
    static instance;
    static db
    constructor() {
        DBConnection.instance = this;
        this.connect()
    }

    connect() {
        DBConnection.db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'facilitime'
        });

        DBConnection.db.connect(err => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);
            } else {
                console.log('Conectado ao banco de dados.');
            }
        });
    }
}

module.exports = DBConnection