module.exports.policies = {
  AuthController: {
    login       : true,
    me          : ['verifyToken', 'ensureToken'],
    edit          : ['verifyToken', 'ensureToken'],
    resetpassword : ['verifyToken', 'ensureToken'],
    refreshToken: true,
    signup      : true
  },
  HospitalController: {
  	create       : ['verifyToken', 'ensureToken'],
    user_hospitals: ['verifyToken', 'ensureToken']
  }

};
