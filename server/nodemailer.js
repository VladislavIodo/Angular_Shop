const nodemailer = require('nodemailer');

// const poolConfig = "smtp://carpenter.store.netcracker@gmail.com:xtdslvelrtzeityd@smtp.mail.ru/?pool=true";

const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'carpenter.store.netcracker@gmail.com',
      pass: 'exiugoendzvjeyrg'
    }
  },
  {
    from: 'Carpenter <carpenter.store.netcracker@gmail.com>',
  });

transporter.verify((error, success) => {
  error ? console.log(error) :
    console.log('Server is ready to take our messages: ', success)
})

const mailer = message => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err)
    console.log('Email sent: ', info)
  })
}

module.exports = mailer
