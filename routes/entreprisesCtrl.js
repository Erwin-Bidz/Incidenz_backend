//Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils.entreprise');
var models = require('../models');
var asyncLib = require('async');

module.exports = {
    
    login: function(req, res) {
        
    // Params
    var nom      = req.body.nom;
    var password = req.body.password;
    console.log(req.body)

    if (nom == null ||  password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Entreprise.findOne({
          where: { nom: nom }
        })
        .then(function(entrepriseFound) {
          done(null, entrepriseFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify entreprise' });
        });
      },
      function(entrepriseFound, done) {
        if (entrepriseFound) {
          bcrypt.compare(password, entrepriseFound.password, function(errBycrypt, resBycrypt) {
            done(null, entrepriseFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'entreprise not exist in DB' });
        }
      },
      function(entrepriseFound, resBycrypt, done) {
        if(resBycrypt) {
          done(entrepriseFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], function(entrepriseFound) {
      if (entrepriseFound) {
        return res.status(201).json({
          'entrepriseId': entrepriseFound.id,
          'token': jwtUtils.generateTokenForEntreprise(entrepriseFound),
          'entrepriseName': entrepriseFound.nom,
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on entreprise' });
      }
    });
    },
    
    logout: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var EntrepriseId     = jwtUtilsEntreprise.getEntrepriseId(headerAuth);
      EntrepriseId = -1;
      // Effacez le token de l'utilisateur ou effectuez d'autres actions de déconnexion nécessaires
      // delete req.user.token;
      // Ensuite, vous pouvez renvoyer une réponse appropriée, par exemple:
      return res.status(200).json({ 'message': 'user logged out successfully' });
    },
    
    createEntreprise: function(req, res) {
        //Params
        var nom        = req.body.nom;
        var password = req.body.password;
        var contact = req.body.contact;
        var email = req.body.email;

        //TODO verify pseudo length, mail regex, password...
        if (nom == null || password == null || email == null ) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (nom.length >= 25 || nom.length <= 2) {
            return res.status(400).json({ 'error': 'wrong name: must be length 2 - 25' });
        }

        
        //WATERFALL CREATE NEW ENTREPRISE
        asyncLib.waterfall([
            function(done) {
                models.Entreprise.findOne({
                    attributes: ['nom', 'contact'],
                    where: { nom: nom, contact: contact }
                })
                .then(function(entrepriseFound) {
                    done(null, entrepriseFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify entreprise'});
                });
            },
            function(entrepriseFound, done) {
                if (!entrepriseFound) {
                    bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                        done(null, entrepriseFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'entreprise already exist' });
                }
            },
            function(entrepriseFound, bcryptedPassword, done) {
                var newEntreprise = models.Entreprise.create({
                    nom       : nom,
                    password  : bcryptedPassword,
                    contact   : contact,
                    email     : email
                })
                .then(function(newEntreprise) {
                    done(newEntreprise);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add entreprise' });
                });
            }   
        ], function(newEntreprise) {
            if (newEntreprise) {
                return res.status(201).json({
                    'entrepriseId': newEntreprise.id,
                    'entreprisename': newEntreprise.nom,
                    'entreprisecontact': newEntreprise.contact,
                    'entrepriseEmail': newEntreprise.email,
                })
            } else {
                return res.status(500).json({ 'error': 'cannot add entreprise' });
            }
        });
    },
    listEntreprise: function (req, res) {

        // Body Query Parameters
        var fields = req.query.fields;
        var limit  = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order  = req.query.order;
      
          models.Entreprise.findAll({
            order: [(order != null) ? order.split(':') : ['nom', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            //Recherche dans la BD...
            attributes: ['nom', 'contact'],
            //where: { userType: 'Dev' }
          })
          .then(function(users) {
            if (users) {
              res.status(200).json(users);
            } else {
              res.status(404).json({ "error": "no users found" });
            }
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user'});
          });
        
    },
    searchEntreprise: function (req, res) {
        const { Op } = require("sequelize");
      
        var headerAuth = req.headers['authorization'];
        var UserId = jwtUtils.getUserId(headerAuth);
        var nom = req.query.nom;
      
        //Le user courant
        const user       = models.User.findByPk(UserId);
      
        // Ecrire la condition de recherche
        var whereCondition = {
          nom: {
            [Op.like]: '%' + nom + '%'
          }
        };
                            
        models.Entreprise.findAll({
          attributes: ['nom','contact'],
            where: whereCondition
        }).then(function(entreprises) {
            if (entreprises) {
                res.status(200).json(entreprises);
            } else {
                res.status(404).json({ "error": "no type of incidents found" });
            }
        }).catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify type of incident'});
        });
    },
    getEntreprise: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        //var userId     = jwtUtils.getUserId(headerAuth);
        //var token      = jwtUtils.parseAuthorization(headerAuth);
        var id      = req.param.id;
        //console.log(token);
      
        //if (userId < 0 ) return res.status(400).json({ 'error': 'wrong token' });
      
        models.Entreprise.findOne({
            //attributes: ['username', 'description'],
            where: { id: id }
        }).then(function(user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(500).json({ 'error': 'user not found'});
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch user'});
        });
    },
}