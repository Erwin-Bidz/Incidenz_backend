var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2b$05$GndKnnSxZvRAg9Z9J9d5a.WTD.nnjIlCYWpMVeiYe/1td8T8cE5Mi';

// Exported functions
module.exports = {
    generateTokenForEntreprise: function(entrepriseData) {
      return jwt.sign({
        entrepriseId: entrepriseData.id,
        entrepriseNom: entrepriseData.nom,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '12h'
      })
    },
    parseAuthorization: function(authorization) {
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getEntrepriseId: function(authorization) {
      var entrepriseId = -1;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null && jwtToken.entrepriseId != null)
            entrepriseId = jwtToken.entrepriseId;
        } catch(err) { }
      }
      return entrepriseId;
    },
    getEntrepriseNom: function(authorization) {
      var entrepriseNom;
      var token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
          if(jwtToken != null)
            entrepriseType = jwtToken.entrepriseNom;
        } catch(err) { }
      }
      return entrepriseNom;
    }
  }