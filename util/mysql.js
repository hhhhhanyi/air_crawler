const mysql = require('mysql');
const credentials = require('./../util/credentials.js');

const db = mysql.createConnection({
  host: credentials.MYSQL.host,
  user: credentials.MYSQL.user,
  password: credentials.MYSQL.password,
  database: 'air'
});

db.connect((error) => {
  if (error) throw error;
  console.log('MySQL connected...');
});

module.exports = {
  core: mysql,
  con: db
};
