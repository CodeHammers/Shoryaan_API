"use strict";
var requestHelpers = require('request-helpers');
var _              = require('lodash');

module.exports = {

  admin: (req,res)=>{
    User = sails.models.user 
    Hospital = sails.models.hospital 
    User.find().then(
      (users)=>{
        Hospital.find().then(
          (hospitals)=>{
            res.view({data:'saba7 el fol',users:users,hospitals:hospitals,model: Hospital})

          }

        )
      }
    )
  }
};
