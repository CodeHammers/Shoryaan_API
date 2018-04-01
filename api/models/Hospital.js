
module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      index: true,
      unique: true,
      maxLength: 20
    },

    state:{
      type: 'string',
      required: true,
      index: true,
      enum: ["Cairo", "Alexandria", "Giza", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia", "New Valley", "Port Said", "Sharqia", "Suez"]
    },

    email: {
      type: 'email',
      required: false,
      unique: true,
      email: true
    },

    phone: {
      type: 'string',
      required: false,
      unique: true
    },

    address: {
      type: 'string',
      required: true,
      unique: true,
      index: true
    },

    status: {
      type: 'string',
      enum: ['Public', 'Private'],
      index: true
    },

    locationLongitude: {
      type: 'float',
      required: true,
      index: true
    },

    locationLatitdue: {
      type: 'float',
      required: true,
      index: true
    },

    isVerified: {
      type: 'boolean',
      defaultsTo: false
    },

    managers:{
      collection: 'user',
      via: 'hospitals'
    },

    toJSON: function() {
      var hospitalObj = this.toObject();

      return hospitalObj;
    }
  }
};
