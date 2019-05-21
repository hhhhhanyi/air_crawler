const credentials = require('./../util/credentials.js');
const nodemailer = require('nodemailer');
const fs = require('fs');

const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: credentials.MAIL.user,
    pass: credentials.MAIL.password
  }
});

const error = function error (error) {
  if (error.sql) {
    /* MySQL Error */
    fs.appendFileSync('./log/sql.log', `\n\n${error}\nTime: ${new Date()}`, 'utf8');
  } else if (error.request) {
    /* CRAWLER Error */
    mailTransport.sendMail({
      from: credentials.MAIL.user,
      to: credentials.MAIL.user,
      subject: 'Hi! ERROR! :)',
      html: error.request
    }, (error) => {
      if (error) {
        console.log('Unable to send email:' + error);
      }
    });
    fs.appendFileSync('./log/request.log', `\n\n${error.request}\nTime: ${new Date()}`, 'utf8');
  } else if (error.api) {
    /* API Error */
    fs.appendFileSync('./log/api.log', `\n\n${error.api}\n${JSON.stringify(error.error)}\nTime: ${new Date()}`, 'utf8');
    let apiError = {
      status: 'error',
      statusCode: 404,
      flight: '沒有找到相關飛行航班，<br>請調整其他搜索範圍。'
    };
    return apiError;
  } else {
    /* OTHER Error */
    fs.appendFileSync('./log/error.log', `\n\n${error}\nTime: ${new Date()}`, 'utf8');
  };
};

module.exports = {
  error: error
};