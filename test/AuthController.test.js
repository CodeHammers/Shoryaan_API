var request = require('supertest');
var assert  = require('chai').assert;
//const authService = require('../api/services/AuthService');

describe('AuthController', () => {
  var loginCredentials = {
    password: 'testingsingup',
    email   : 'sayed111@testing.com'
  };



  describe('#signup()', () => {
    it('should register the user', (done) => {
      request(sails.hooks.http.app)
        .post('/auth/signup')
        .send({
          username: 'Tester111',
          password: 'testingsingup',
          email   : 'sayed111@testing.com'
        })
        .expect(200, (error, signupResponse) => {
          assert.isDefined(signupResponse.body.access_token);
          assert.isDefined(signupResponse.body.refresh_token);

          done();
        });
    });
  });


  describe('#login()', () => {
    it('should login with given credentials', (done) => {
      var authService = sails.services.authservice;
     // console.log(authService)
      // login
      request(sails.hooks.http.app)
        .post('/auth/login')
        .send({
          username: 'Tester111',
          password: 'testingsingup',
          email   : 'sayed111@testing.com'
        })
        .expect(200, (error, response) => {
          
          var body = response.body;
          //console.log(body)

          assert.isDefined(body.access_token);
          assert.isDefined(body.refresh_token);
          //done();
          authService.verifyToken(body.access_token).then(accessToken => {
            return authService.verifyToken(body.refresh_token).then(refreshToken => {

              // check if refreshToken unique matches the tokens `iat`
              assert.equal(refreshToken.unique, accessToken.iat + '.' + accessToken.user);

              done();
            });
          }).catch(error => {
            assert.ifError(error);
          });

          
        });
    });
  });


  describe('#refreshToken()', () => {
    it('should generate tokens with new expire date', (done) => {

      request(sails.hooks.http.app)
        .post('/auth/login')
        .send(loginCredentials)
        .expect(200, (error, loginResponse) => {
     
          var query = {
            access_token : loginResponse.body.access_token,
            refresh_token: loginResponse.body.refresh_token
          };
          

          // make request to extend TTL of the token, wait 1 second to generate a new `iat`
          setTimeout(() => {
            request(sails.hooks.http.app)
              .post('/auth/refresh-token')
              .send(query)
              .expect(200, (error, refreshResponse) => {
        
                function decode(token) {
                  return sails.services.authservice.decodeToken(token);
                }

                function deleteProps(obj) {
                  delete obj.iat; // issued at time
                  delete obj.exp; // expire date

                  return obj;
                }

                var body                = refreshResponse.body;
                var newToken            = decode(body.access_token);
                var newRefreshToken     = decode(body.refresh_token);
                var orginalToken        = decode(query.access_token);
                var orginalRefreshToken = decode(query.refresh_token);

                assert.isDefined(body.access_token);
                assert.isDefined(body.refresh_token);

                // check if the new expire date is higher in the new token than in the old one
                assert.isAbove(newToken.exp, orginalToken.exp);
                assert.isAbove(newRefreshToken.exp, orginalRefreshToken.exp);

                // check if the generated refreshToken unique matches the new token iat
                assert.equal(newRefreshToken.unique, newToken.iat + '.' + newToken.user);

                // check if the `iat` and the `exp` are changed
                assert.notEqual(newToken.iat, orginalToken.iat);
                assert.notEqual(newRefreshToken.iat, orginalRefreshToken.iat);
                assert.notEqual(newToken.exp, orginalToken.exp);
                assert.notEqual(newRefreshToken.exp, orginalRefreshToken.exp);

                // check if the data within the token is the same as in the old one
                assert.deepEqual(deleteProps(newToken), deleteProps(orginalToken));

                done();
              });
          }, 1000);
        });
    });
  });

});
