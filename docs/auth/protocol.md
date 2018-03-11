# Auth Protocol
API uses token-based auth to authorize users' action based on their roles , there are two tokens: 
refresh token : used to get a new access token to avoid getting your token expired
.access token : should be included in all requests to maintain identity , access token is sent on sign_in /sign_up/refresh_token

## Routes

These are the routes provided by this hook:

```javascript
module.exports.routes = {
  'POST /login'                  : 'AuthController.login',
  'POST /signup'                 : 'AuthController.signup',
  'GET /auth/verify-email/:token': 'AuthController.verifyEmail',
  'GET /auth/me'                 : 'AuthController.me',
  'POST /auth/refresh-token'     : 'AuthController.refreshToken'
};
```

### POST /auth/login

The request to this route `/auth/login` must be sent with these body parameters:

```javascript
{
  email   : 'email@test.com', // or username based on the `loginProperty`
  password: 'test123'
}
```

The response:

```javascript
{
  access_token : 'jwt_access_token',
  refresh_token: 'jwt_refresh_token'
}
```

Make sure that you provide the acquired token in every request made to the protected endpoints, as query parameter `access_token` or as an HTTP request `Authorization` header `Bearer TOKEN_VALUE`.

The default TTL of the `access_token` is 1 day, `refresh_token` is 30 days.
If the `access_token` is expired you can expect the `expired_token` error.


### POST /auth/signup

The request to this route `/signup` must be sent with these body parameters:

```javascript
{
  username       : 'test',
  email          : 'email@test.com',
  password       : 'test123'
}
```

If the email verification feature is disabled, the response will be the same as the `/auth/login`.

```javascript
{
  access_token : 'new jwt access token',
  refresh_token: 'new jwt refresh token'
}
```

If it's enabled you will get a 200 as response:

### GET /auth/activate/:token

#### Account Activation

This feature is off by default and to enable it you must override the `requireEmailVerification` configuration and implement the function `sendVerificationEmail`:

```javascript
module.exports.auth = {
  secret                  : process.env.JWT_SECRET || 'superSecretForDev',
  loginProperty           : 'email',
  requireEmailVerification: false,
  sendVerificationEmail   : (user, activateUrl) => {
    sails.log.error('sails-hook-authorization:: An email function must be implemented through `sails.config.auth.sendVerificationEmail` in order to enable the email verification feature. This will receive two parameters (user, activationLink).');
  },

  // seconds to be valid
  ttl: {
    accessToken : process.env.JWT_TOKEN_TTL || 86400,  // 1 day
    refreshToken: process.env.JWT_REFRESH_TOKEN_TTL || 2592000 // 30 days
  }
};

```

### GET /auth/me

Returns the user, token protected area.

### POST /auth/refresh-token

Refreshes the `access_token` based on the `refresh_token`.
If the `refresh_token` is expired it will return `expired_refresh_token` and the user must login through `/login`

The request:

```javascript
{
  access_token : 'jwt access token',
  refresh_token: 'jwt refresh token'
}
```

The response:

```javascript
{
  access_token : 'new jwt access token',
  refresh_token: 'new jwt refresh token'
}
```