const dbConfig = require('../config/db');
const Database = require('../classes/database');
const db = new Database(dbConfig.dev.pool);


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MY_KEY = require('../config/jwt');

module.exports = {
  validateUser: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let sql = `
    SELECT user_email,ID
    FROM users
    WHERE user_email = ${db.connection.escape(email)}
  `;

    db.query(sql)
      .then(async (data) => {
        if (data.length == 0) {
          res.status(404).send('Email not found please SignUp before login!');
        } else if (data.length != 0) {
          let sql2 = `
          SELECT 
            user_pass
          FROM users
          WHERE user_email = ${db.connection.escape(email)}
        `;
          return db.query(sql2).then((data2) => {
            bcrypt.compare(password, data2[0].user_pass).then((result) => {
              if (result == true) {
                const jwtToken = jwt.sign(
                  { email: email, userID: data[0].ID },
                  My_KEY.jwtSecret,
                  {
                    expiresIn: '1h',
                  }
                );
                res.status(200).send({
                  message: 'Login Successful!',
                  userData: data,
                  accessToken: jwtToken,
                });
              } else if (result == false) {
                res.status(401).send('Incorrect password');
              }
            });
          });
        }
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  },

  signUp: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let sql = `
    SELECT user_email FROM users WHERE user_email = ${db.connection.escape(
      email
    )}
    `;
    db.query(sql)
      .then((data) => {
        if (data.length == 0) {
          bcrypt.hash(password, 8).then(async (hash) => {
            let sql2 = `
          INSERT INTO users (
            user_email,
            user_pass,
            user_registered,
            user_login,
            user_nicename,
            display_name
          )
          VALUES (
            ${db.connection.escape(email)},
            ${db.connection.escape(hash)},
            NOW(),
            LOWER(${db.connection.escape(firstName)}),
            LOWER(${db.connection.escape(firstName)}),
            LOWER(${db.connection.escape(firstName + ' ' + lastName)})
          )
          `;

            return db
              .query(sql2)
              .then((data2) => {
                let sql3 = ` Insert into users('user_name,user_email') values('rj','r@gmail.com')
              `;

                db.query(sql3).then((data3) => {
                  res.status(200).send({ message: 'success', data: data3 });
                });
              })
              .catch((err) => {
                res.status(500).send({ message: err.message });
              });
          });
        } else if (data.length != 0) {
          res.status(409).send('Email already exists!! Please login');
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  },
};
