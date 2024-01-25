var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2b$05$GndKnnSxZvRAg9Z9J9d5a.WTD.nnjIlCYWpMVeiYe/1td8T8cE5Mi';

// Exported functions
module.exports = {
    generateTokenForAdmin: function(adminData) {
      return jwt.sign({
        adminId: adminData.id,
        adminNom: adminData.nom,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '12h'
      })
    },
    parseAuthorization: function(authorization) {
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getAdminId: function(authorization) {
      var adminId = -1;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null && jwtToken.adminId != null)
            adminId = jwtToken.adminId;
        } catch(err) { }
      }
      return adminId;
    },
    getAdminNom: function(authorization) {
      var adminNom;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null)
          adminNom = jwtToken.adminNom;
        } catch(err) { }
      }
      return adminNom;
    }
  }