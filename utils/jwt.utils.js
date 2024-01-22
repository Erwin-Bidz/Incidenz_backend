var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2b$05$GndKnnSxZvRAg9Z9J9d5a.WTD.nnjIlCYWpMVeiYe/1td8T8cE5Mi';

// Exported functions
module.exports = {
    generateTokenForUser: function(userData) {
      return jwt.sign({
        userId: userData.id,
        tel: userData.tel,
        isBlocked: userData.isBlocked,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '12h'
      })
    },
    parseAuthorization: function(authorization) {
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
      var userId = -1;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null && jwtToken.userId != null)
            userId = jwtToken.userId;
        } catch(err) { }
      }
      return userId;
    },
    getIsBlocked: function(authorization) {
      var isBlocked;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null)
            isBlocked = jwtToken.isBlocked;
        } catch(err) { }
      }
      return isBlocked;
    },
    getTel: function(authorization) {
      var tel;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null)
            tel = jwtToken.tel;
        } catch(err) { }
      }
      return tel;
    }
  }