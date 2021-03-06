"use strict";
var requestHelpers = require('request-helpers');
var _              = require('lodash');

module.exports = {
  login: (req, res) => {
    var authService   = sails.services.authservice;
    var authConfig    = sails.config.auth;
    var loginProperty = authConfig.identityOptions.loginProperty;
    var populate      = authConfig.identityOptions.populate;
    var params        = requestHelpers.secureParameters([{param: 'password', cast: 'string'}, loginProperty], req, true);
    var user, accessToken, findUser;

    if (!params.isValid()) {
      return res.badRequest({message: 'missing_parameters'}, params.getMissing());
    }

    params = params.asObject();

    if (authConfig.wetland) {
      findUser = req.getRepository(sails.models.user.Entity).findOne({[loginProperty]: params[loginProperty]}, {populate: populate});
    } else {
      findUser = sails.models.user['findOneBy' + _.upperFirst(loginProperty)](params[loginProperty]);

      if (true === populate) {
        findUser.populateAll();
      } else if (Array.isArray(populate)) {
        populate.forEach(function (relation) {
          findUser.populate(relation);
        })
      } else if (typeof populate === 'string') {
        findUser.populate(populate);
      }
    }

    findUser
      .then(foundUser => {
        if (typeof foundUser !== 'object' || !foundUser) {
          throw {message:'invalid_credentials'};
        }

        user = foundUser;

        return authService.validatePassword(params.password, foundUser.password);
      })
      .then(() => {
        //sails.log.info('helloooooooooooooooooooooooooooooooooooooooooooooooo')
        //console.log("--------------------------------------------------------")
        console.log(authConfig.identityOptions.requireEmailVerification )
        if (authConfig.identityOptions.requireEmailVerification && !user.emailConfirmed) {
          throw {message:'email_not_confirmed'};
        }

        accessToken = authService.issueTokenForUser(user);

        return res.ok({
          access_token : accessToken,
          refresh_token: authService.issueRefreshTokenForUser(accessToken)
        });
      })
      .catch(error => {
        if (typeof error === 'string') {
          return res.badRequest(error);
        }

        return res.negotiate(error);
      });
  },

  resetpassword: (req,res) => {
    var authConfig    = sails.config.auth;
    var loginProperty  = authConfig.identityOptions.loginProperty;
    var authService   = sails.services.authservice;

    var params = requestHelpers.secureParameters([{param: 'password', cast: 'string'}, {param:'reset_password'}], req, true);
    params = params["data"]
    let model = sails.config.auth.wetland ? req.getRepository(sails.models.user.Entity) : sails.models.user;
    model.findOne({id:req.access_token.user}).then(
      (foundUser)=>{
        authService.validatePassword(params['password'], foundUser.password).then(
          (valid)=>{
            foundUser.password =  params['reset_password']
            foundUser.save().then(
              (saved)=>{
                res.ok()
              }
            )
          },(invalid)=>{
            res.badRequest({password:params['password']})
          }
        )
      }
    )


  },

  //https://graph.facebook.com/me?access_token=123456
  login_facebook: (req,res) => {
    var authService   = sails.services.authservice;
    var params = requestHelpers.secureParameters([{param: 'access_token'}], req, true);
    params = params["data"]

    authService.verifyFacebookUserAccessToken(params['access_token']).then(
      (user)=>{
        console.log(user)
        user.password ='very_long_password_placeholder__will_be_replaced_by_token_in_production_env'
        user.username =  user.name
        if(user.gender == 'male')  user.gender = 'Male'
        if(user.gender == 'female')  user.gender = 'Female'

        user.emailConfirmed = true
        sails.models.user.create(user).then(
          (newUser)=>{
                  //console.log(params['access_token'])
            res.ok({
              user: newUser,
              access_token: authService.issueTokenForUser(newUser)
            })

          },(err)=>{
            console.log(err)

            sails.models.user.findOne({email:user.email}).then(
              (foundUser)=>{
              res.ok({
                user: foundUser,
                access_token: authService.issueTokenForUser(foundUser)
              })
              },
              (err)=>{
                console.log(err)
              }
              )

            //res.badRequest(err.invalidAttributes)
          }
          )

  
      },
      (error)=>{
        //console.log(params['access_token'])
        res.badRequest({message:error.message})
      }
    )
  },

  edit: (req,res) => {
    var authConfig    = sails.config.auth;
    var loginProperty  = authConfig.identityOptions.loginProperty;

    var params = requestHelpers.secureParameters([{param: 'password', cast: 'string'}, {param:'username'},{param:'bloodtype'},{param:'gender'},
                {param: 'city'}, {param: 'name'}, {param: 'state'}, {param: 'dateOfBirth'},{param:'lat'},{param:'lng'}], req, true);

    params = params["data"]

    let model = sails.config.auth.wetland ? req.getRepository(sails.models.user.Entity) : sails.models.user;

    model.update({id: req.access_token.user}, {username: params['username'], bloodtype: params['bloodtype'],gender: params['gender'],
                city: params['city'], name: params['name'], state: params['state'], dateOfBirth: params['dateOfBirth'] , lat: params['lat'],lng: params['lng'] })
      .then(  (user)=>{ params['password']='filtered', res.ok,res.json(params) })
      .catch(res.negotiate)
  },
  
  me: (req, res) => {
    let model = sails.config.auth.wetland ? req.getRepository(sails.models.user.Entity) : sails.models.user;
    model.findOne(req.access_token.user)
      .then(res.ok)
      .catch(res.negotiate);
  },

  refreshToken: (req, res) => {
    var params      = requestHelpers.secureParameters(['refresh_token'], req, true);
    var authService = sails.services.authservice;

    if (!params.isValid()) {
      return res.badRequest({message: 'missing_parameters'}, params.getMissing());
    }

    params = params.asObject();

    try {
      var accessToken = authService.findAccessToken(req);
    } catch (error) {
      return error.error === 'invalid_token' ? res.forbidden(error) : res.negotiate(error);
    }

    params.access_token = accessToken;

    authService
      .validateRefreshToken(params.access_token, params.refresh_token)
      .then(res.ok)
      .catch(res.badRequest);
  },

  signup: (req, res) => {
    var authConfig     = sails.config.auth;
    var loginProperty  = authConfig.identityOptions.loginProperty;
    var paramBlueprint = authConfig.identityOptions.parameterBlueprint.concat([{param: 'password', cast: 'string'}]);
    var params         = requestHelpers.secureParameters(paramBlueprint, req, true);
    var populate       = authConfig.identityOptions.populate;
    var authService    = sails.services.authservice;
    var accessToken, manager, findUser, UserEntity;

    if (!params.isValid()) {
      return res.badRequest({message: 'missing_parameters'}, params.getMissing());
    }

    params = params.asObject();

    if (authConfig.wetland) {
      UserEntity = sails.models.user.Entity;
      manager    = req.getManager();
      findUser   = manager.getRepository(UserEntity).findOne({[loginProperty]: params[loginProperty]});
    } else {
      findUser = sails.models.user['findOneBy' + _.upperFirst(loginProperty)](params[loginProperty]);
    }

    findUser
      .then(userExists => {
        if (!userExists) {
          return params;
        }

        throw userExists.email === params.email && loginProperty === 'email' ? {message:'exists_email'} : {message:'exists_username'};
      })
      .then(newUser => {
        if (authConfig.wetland) {
          let newRecord = req.wetland.getPopulator(manager).assign(UserEntity, newUser);

          return manager.persist(newRecord).flush();
        }

        return sails.models.user.create(newUser).then();
      })
      .then(user => {
        let findUser;

        if (authConfig.wetland) {
          findUser = manager.getRepository(UserEntity).findOne(user.id, {populate: populate});
        } else {
          findUser = sails.models.user.findOne(user.id);

          if (true === populate) {
            findUser.populateAll();
          } else if (Array.isArray(populate)) {
            populate.forEach(function(relation) {
              findUser.populate(relation);
            })
          } else if (typeof populate === 'string') {
            findUser.populate(populate);
          }

          findUser.then();
        }

        return findUser;
      })
      .then(user => {
        if (!authConfig.identityOptions.requireEmailVerification) {
          return user;
        }

        // return given password instead of encrypted one
        user.password = params.password;

        authConfig.sendVerificationEmail(user, authService.issueToken({activate: user.id}));

        delete user.password;

        return user;
      }).then((user) => {
        if (authConfig.identityOptions.requireEmailVerification) {
          return res.ok(user);
        }

        accessToken = authService.issueTokenForUser(user);

        res.ok({
          access_token : accessToken,
          refresh_token: authService.issueRefreshTokenForUser(accessToken)
        });
      }).catch(res.badRequest);
  },

  verifyEmail: (req, res) => {
    var params = requestHelpers.secureParameters(['token'], req, true);
    var authService    = sails.services.authservice;
    let model = sails.config.auth.wetland ? req.getRepository(sails.models.user.Entity) : sails.models.user;

    if (!params.isValid()) {
      return res.badRequest({message: 'missing_parameters'}, params.getMissing());
    }

    var manager;

    params = params.asObject();

    authService.verifyToken(params.token)
      .then(decodedToken => {
        if (sails.config.auth.wetland) {
          manager = req.getManager();

          return manager.getRepository(sails.models.user.Entity).findOne(decodedToken.activate);
        }

        return model.findOne(decodedToken.activate);
      }).then(user => {
      if (!user) {
        throw 'invalid_user';
      }

      user.emailConfirmed = true;

      if (sails.config.auth.wetland) {
        return manager.flush();
      }

      return user.save();
    }).then(() => {
      res.ok();
    }).catch(error => {
      if (typeof error === 'string') {
        return res.badRequest(error);
      }

      return res.negotiate(error);
    });
  },

  donors_public: (req, res) => {
    let model = sails.config.auth.wetland ? req.getRepository(sails.models.user.Entity) : sails.models.user;
    model.find({/* select: ['bloodtype','lat','lng']*/})
    .then(
      (users)=>{
        res.ok(users)
      })

  }
};
