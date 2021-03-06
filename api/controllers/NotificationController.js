var requestHelpers = require('request-helpers');

module.exports = {
	index: (req, res) => {


        var params = requestHelpers.secureParameters([{param: 'id'},{param: 'bloodtype'}], req, true);
        model = sails.models.notification;
        params = params["data"];

        search =  params.id ?  {hospital: params.id} : params.bloodtype ? {bloodTypes: {'contains' : params.bloodtype} } : {} 

        model.find(search)
        .then(
            (data)=>{console.log(data);res.ok(data)},
            (err)=>{res.badRequest(err)}
        )
    },

    create: (req, res)=>{
         var params = requestHelpers.secureParameters([{param: 'content'},{param: 'details'},{param: 'title'},{param: 'hospital'},{param: 'position'},{param: 'bloodTypes'}], req, true);
        
        params = params["data"];
        console.log(req.body)
        model = sails.models.notification;
        params.lat = req.body.position.latitude
        params.lng = req.body.position.longitude
        params.details = params.content || params.details

        model.create(params)
        .then(
            (data)=>{res.ok(data)},
            (err)=>{res.badRequest(err)})

    },

    update: (req, res)=>{
         var params = requestHelpers.secureParameters([{param: 'content'},{param: 'details'},{param: 'title'},{param: 'position'},{param: 'bloodTypes'},{param: 'n_id'}], req, true);

        params = params["data"];

        model = sails.models.notification;
        params.lat = req.body.position.latitude
        params.lng = req.body.position.longitude
        params.details = params.content || params.details

        model.update({id: params.n_id},params)
        .then(
            (data)=>{res.ok(data)},
            (err)=>{res.badRequest(err)})


    },

};