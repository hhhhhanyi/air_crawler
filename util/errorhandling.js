const credentials = require('./../util/credentials');
const nodemailer = require('nodemailer');
const fs = require('fs');

const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: credentials.MAIL.user,
    pass: credentials.MAIL.password
  }
});

const error = (error) => {
  if (error.sql) {
    /* MySQL Error */
    fs.appendFileSync('./log/sql.log', `\n\n${JSON.stringify(error)}\nTime: ${new Date()}`, 'utf8');
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
    const apiError = {
      status: 'error',
      statusCode: 404,
      error: '沒有找到相關飛行航班，<br>請調整其他搜索範圍。'
    };
    return apiError;
  } else {
    /* OTHER Error */
    fs.appendFileSync('./log/error.log', `\n\n${JSON.stringify(error)}\nTime: ${new Date()}`, 'utf8');
  };
};

module.exports = {
  error: error
};
