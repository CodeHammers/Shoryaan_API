var requestHelpers = require('request-helpers');

module.exports = {
    index: (req, res) => {
        model = sails.models.hospital;

        search = {};
        if(req.query.name != null) search.name = req.query.name;
        if(req.query.state != null) search.state = req.query.state;
        if(req.query.status != null) search.status = req.query.status;
        //start with
        model.find(search)/*.populate('managers')*/.then(
            (payload)=>{
                res.ok(payload);
            },
            (err)=>{
                res.badRequest(err);
            }
        )
    },

    create: (req, res)=>{
        var params = requestHelpers.secureParameters([{param: 'name'}, {param: 'district'}, {param: 'state'}, {param: 'email'}, {param: 'phone'},  {param: 'address'}, {param: 'status'},
                     {param: 'locationLongitude'}, {param: 'locationLatitude'}, {param: 'isVerified'}], req, true);
        
        params = params["data"];
        params['managers']=[req.access_token.user]
        //console.log(req.access_token.user)
        model = sails.models.hospital;
        if(params['district']==null)
            params['district'] ='default value'
        //console.log(sails.models.hospital)
        model.create(params).then(
            (payload)=>{
                model.findOne({id:payload.id}).populate('managers').then(
                    (d)=>{
                        sails.models.user.update({id: req.access_token.user},{hospitalManager:true}).then(
                            (usr)=>{
                                res.ok(d)
                            }

                        )

                    }
                )               
            },
            (err)=>{
                console.log(err)
                res.badRequest(err.invalidAttributes);
            }
        )
    },

    update: (req, res)=>{
        var params = requestHelpers.secureParameters([{param: 'name'}, {param: 'district'}, {param: 'email'}, {param: 'phone'}, {param: 'address'}, {param: 'status'},
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
        var params = requestHelpers.secureParameters([{param: 'name'}], req, true);

        params = params["data"];

        model = sails.models.hospital;

        model.destroy({name:params['name']}).then(
            (payload)=>{
                res.ok({operation: 'success'});
            },
            (err)=>{
                res.badRequest(err.invalidAttributes);
            }
        )
    },
    user_hospitals: (req,res)=>{
        model = sails.models.user;
        
        
        model.findOne({id: req.access_token.user}).populate('hospitals')
        .then(
            (user)=>{
                res.ok(user.hospitals)
            }
        )
   
    }
};