var bcrypt = require('bcrypt');

module.exports = {
  
  attributes: {

    username: {
      type : 'string',
      required: true,
      maxLength: 20,
      index: true
    },

    name: {
      type: 'string',
      required: false,
      maxLength: 30
    },

    email: {
      type : 'email',
      required: true,
      unique: true,
      email: true
    },

    password: {
      type: 'string',
      required: true,
      minLength: 8
    },

    bloodtype:{
      type: 'string',
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-','?'],
      required: false,
      defaultsTo: '?',
      index: true
    },

    gender:{
      type: 'string',
      enum: ['Male', 'Female'],
      required: false
    },

    dateOfBirth:{
      type: 'string', 
      required: false
    },

    city:{
      type: 'string',
      required: false
    },

    state:{
      type: 'string',
      enum: ["Cairo", "Alexandria", "Giza", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia", "New Valley", "Port Said", "Sharqia", "Suez"],
      required: false,
      index: true
    },

    emailConfirmed: {
      type: 'boolean',
      defaultsTo: false
    },

    hospitalManager: {
      type: 'boolean',
      defaultsTo: false
    },

    hospitals:{
      collection: 'hospital',
      via: 'managers'
    },

    toJSON: function() {
      var userObj = this.toObject();

      delete userObj.password;

      return userObj;
    }
  },

  beforeCreate: encryptPassword,
  beforeUpdate: validatePassword
};

//callback functions

function validatePassword(userObj, next){
  if (!userObj.password) {
    delete userObj.password;

    return next();
  }

  try {
    // check if the password is already hashed
    bcrypt.getRounds(userObj.password);
  } catch(e) {
    return encryptPassword(userObj, next);
  }

  next();
}

function encryptPassword(userObj, next) {
  if (!userObj.password) {
    return next();
  }

  bcrypt.hash(userObj.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }

    userObj.password = hash;

    next();
  });
}
