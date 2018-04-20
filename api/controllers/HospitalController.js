var requestHelpers = require('request-helpers');

module.exports = {
	index: (req, res) => {
        model = sails.models.hospital;

        search = {};
        if(req.query.name != null) search.name = { startsWith : req.query.name } //req.query.name;
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
                 {param: 'state'},   {param: 'isVerified'}], req, true);
        
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
   
    },
    hospital_users: (req,res)=>{

        model = sails.models.hospital;
        console.log(req.query.id)

        
        model.findOne({id: req.query.id}).populate('managers')
        .then(
            (h)=>{
                console.log(h.managers)
                res.ok(h.managers)
            }
        )


    },
    add_user_to_hospital: (req,res)=>{
        model = sails.models.hospital;

        model.findOne({id:req.query.user_email}).then(

            (u)=>{req.query.user_id = u.id}
            )

        
        model.findOne({id: req.query.id}).populate('managers')
        .then(
            (h)=>{
                //res.ok(h.managers)
                h.managers.add(req.query.user_id)
                h.save().then( ()=>{
                    model.findOne({id: req.query.id}).populate('managers')
                    .then((r)=>{res.ok(r)})
            })
        })
    }
};