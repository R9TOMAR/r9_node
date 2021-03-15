const mysql = require('mysql');

module.exports = class Database {
  constructor(config) {
    this.connection = mysql.createPool(config);
    this.connection.on('connection', () => {
      // console.log('Connected to Database!!');
    })
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
