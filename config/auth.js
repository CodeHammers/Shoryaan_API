module.exports.auth = {

  sendVerificationEmail: (user, activateToken) => {

    const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type:'OAuth2',
        user: 'kareememad400@gmail.com',
        clientId: '912516131016-331k0ml8uc2u735s5dk39ka3lgicisqj.apps.googleusercontent.com',
        clientSecret: 'feE8mlAw-tQJ1gn1gkWEkg2O',
        refreshToken: '1/PgH6YqIiIReB0b1WLcrG_pIB-Jbqf0ZQRGOxo_3-Mbv2Dujcdp3HGX7X4QK90Mq3',
        accessToken:'Your_accessToken'
,
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'kareememad400@gmail.com',
            clientId: '912516131016-331k0ml8uc2u735s5dk39ka3lgicisqj.apps.googleusercontent.com',
            clientSecret: 'feE8mlAw-tQJ1gn1gkWEkg2O',
            refreshToken: '1/PgH6YqIiIReB0b1WLcrG_pIB-Jbqf0ZQRGOxo_3-Mbv2Dujcdp3HGX7X4QK90Mq3',
            accessToken:'Your_accessToken'

        })
    }
})

var mailOptions = {
    from: 'kareem <kareememad400@gmail.com>',
    to: user.email,
    subject: 'Shoryaan Account Verification',
    text: 'click to activate your account:  ' + 'http://localhost:1337/auth/verify-email/'+activateToken
}

    transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log('Error');
            console.log(err)
        } else {
            console.log('Email Sent');
        }
    })

    //sails.log.error('sails-hook-authorization:: An email function must be implemented through `sails.config.auth.sendVerificationEmail` in order to enable the email verification feature. This will receive two parameters (user, activationToken).');
  },

  // Options concerning a user's identity
  identityOptions: {

    // Property to use for login (one of "email" or "username").
    loginProperty: 'username',

    // Options for user signup. @see https://www.npmjs.com/package/request-helpers
    parameterBlueprint: ['username', {param: 'email', required: false},{param: 'bloodtype',required: false}],

    // Option to define which relations to populate on the user find
    // can be an array (of relations), a string (single relation), or a boolean (all or nothing).
    populate: true,

    // Whether or not you wish to require a user to validate their email address before being able to log in.
    requireEmailVerification: true
  },

  jwt: {
    payloadProperties: [],
    accessTokenTtl   : process.env.JWT_TOKEN_TTL || 86400,  // 1 day
    refreshTokenTtl  : process.env.JWT_REFRESH_TOKEN_TTL || 2592000, // 30 days
    secret           : process.env.JWT_SECRET || 'superSecretForDev'
  },

  wetland: false
};
