
module.exports = {

  attributes: {

    title: {
      type: 'string',
    },

    details:{
      type: 'string',
    },
    lat:{
      type: 'float'
    },
    lng:{
      type: 'float'
    },
    address:{
      type: 'string'
    },
    bloodTypes:{
      type: 'string'
    },
    hospital: {
      model: 'hospital'
    },
    toJSON: function() {
      var obj = this.toObject();

      return obj;
    }
  }
};
