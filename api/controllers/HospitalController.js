var requestHelpers = require('request-helpers');

module.exports = {
	index: (req, res) => {
        model = sails.models.hospital;

        search = {};
        if(req.query.name != null) search.name =  { startsWith : req.query.name} ;
        if(req.query.state != null) search.state = req.query.state;
        if(req.query.status != null) search.status = req.query.status;
        //start with
        model.find({ }).where(search).then(
            (payload)=>{
                res.ok(payload);
            },
            (err)=>{
                res.badRequest(err);
            }
        )
    },

    create: (req, res)=>{

        var params = requestHelpers.secureParameters([{param: 'name'}, {param: 'state'}, {param: 'email'}, {param: 'phone'},  {param: 'address'}, {param: 'status'},
                     {param: 'locationLongitude'}, {param: 'locationLatitude'}, {param: 'isVerified'}], req, true);
        
        params = params["data"];

        model = sails.models.hospital;
        //console.log(params)
        model.create(params).then(
            (payload)=>{
                res.ok(payload);
            },
            (err)=>{
                res.badRequest(err.invalidAttributes);
            }
        )
    },

    update: (req, res)=>{
        var params = requestHelpers.secureParameters([{param: 'name'}, {param: 'email'}, {param: 'phone'}, {param: 'address'}, {param: 'status'},
                    {param: 'isVerified'}], req, true);
        
        params = params["data"];

        model = sails.models.hospital;

        model.update({name:params['name']}, params).then(
            (payload)=>{
                res.ok(payload);
            },
            (err)=>{
                res.badRequest(err.invalidAttributes);
            }
        )
    },

    destroy: (req, res)=>{
        //var params = requestHelpers.secureParameters([{param: 'name'}], req, true);

        //params = params["data"];

        model = sails.models.hospital;

        console.log(req.query.id)
        model.destroy({id:req.query.id}).then(
            (payload)=>{
                res.ok({operation: 'success'});
            },
            (err)=>{
                res.badRequest(err.invalidAttributes);
            }
        )
    }
};