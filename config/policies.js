module.exports.policies = {
  AuthController: {
    login       : true,
    me          : ['verifyToken', 'ensureToken'],
    edit          : ['verifyToken', 'ensureToken'],
    refreshToken: true,
    signup      : true
  }
};
