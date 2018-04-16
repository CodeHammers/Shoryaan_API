var requestHelpers = require('request-helpers');

module.exports = {
	index: (req, res) => {


         var params = requestHelpers.secureParameters([{param: 'id'}], req, true);
        model = sails.models.notification;
        params = params["data"];

        model.find({hospital: params.id})
        .then(
            (data)=>{res.ok(data)},
            (err)=>{res.badRequest(err)}
        )
    },

    create: (req, res)=>{
         var params = requestHelpers.secureParameters([{param: 'details'},{param: 'title'},{param: 'hospital'}], req, true);

        
        params = params["data"];

        model = sails.models.notification;

        model.create(params)
        .then(
            (data)=>{res.ok(data)},
            (err)=>{res.badRequest(err)})

    },

    update: (req, res)=>{
         var params = requestHelpers.secureParameters([{param: 'details'},{param: 'title'},{param: 'hospital'},{param: 'n_id'}], req, true);

        params = params["data"];

        model = sails.models.notification;

        model.update({id: params.n_id},params)
        .then(
            (data)=>{res.ok(data)},
            (err)=>{res.badRequest(err)})


    },

};