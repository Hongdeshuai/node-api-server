const path = require('path');
const mime = require('mime');
const fs = require('fs');
const passwordHash = require('password-hash');
const mailConfig = require('../config/mailer.js');

// generate password hash
exports.generatePasswordHash = function(password) {
    return  passwordHash.generate(password);
};

exports.verifyPassword = function (password, hashed_password) {
  return passwordHash.verify(password, hashed_password);
};

exports.downloadFile = function (file, filename, res) {
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
};

exports.sendMail = function (recipients, subject, content) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: mailConfig.hostname,
        port: mailConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailConfig.username, // generated ethereal user
            pass: mailConfig.password // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: mailConfig.sender, // sender address
        to: recipients, // list of receivers
        subject: subject, // Subject line
        text: 'Hello world?', // plain text body
        html: content // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('*****************1');
            return console.log(error);
        }

        console.log('**************** 2');
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};
