//Imports
var bcrypt = require('bcrypt');
var jwtUtilsAdmin = require('../utils/jwt.utils.admin');
var models = require('../models');
var asyncLib = require('async');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX =  /^[a-zA-Z0-9]{4,9}$/;       ///^(?=.*\d). {4,9}$/;


module.exports = {
    register: function(req, res) {

      var headerAuth = req.headers['authorization'];

        //Params
        var nom       = req.body.nom;
        var prenom       = req.body.prenom;
        var password          = req.body.password;

        //TODO verify pseudo length, mail regex, password...
        if (nom == null || password == null || prenom == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (nom.length >= 14 || nom.length <= 2) {
            return res.status(400).json({ 'error': 'wrong adminName: must be length 3 - 14' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid: must length 4 - 9 and includes 1 number.' });
        }


        //WATERFALL CREATE NEW USER
        asyncLib.waterfall([
            function(done) {
                models.Admin.findOne({
                    attributes: ['nom', 'prenom'],
                    where: { nom: nom, prenom: prenom }
                })
                .then(function(adminFound) {
                    done(null, adminFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify admin'});
                });
            },
            function(adminFound, done) {
                if (!adminFound) {
                    bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                        done(null, adminFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'admin already exist' });
                }
            },
            function(adminFound, bcryptedPassword, done) {
                var newAdmin = models.Admin.create({
                    nom       : nom,
                    password       : bcryptedPassword,
                    prenom          : prenom,
                })
                .then(function(newAdmin) {
                    done(newAdmin);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add admin' });
                });
            }   
        ], function(newAdmin) {
            if (newAdmin) {
                return res.status(201).json({
                    'adminId': newAdmin.id,
                    'adminname': newAdmin.nom,
                    'adminprenom': newAdmin.prenom,
                })
            } else {
                return res.status(500).json({ 'error': 'cannot add admin' });
            }
        });
        
    },
    login: function(req, res) {
        
        // Params
        var nom    = req.body.nom;
        var password = req.body.password;
    
        if (nom == null ||  password == null) {
          return res.status(400).json({ 'error': 'missing parameters' });
        }
    
        asyncLib.waterfall([
          function(done) {
            models.Admin.findOne({
              where: { nom: nom }
            })
            .then(function(adminFound) {
              done(null, adminFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify admin' });
            });
          },
          function(adminFound, done) {
            if (adminFound) {
              bcrypt.compare(password, adminFound.password, function(errBycrypt, resBycrypt) {
                done(null, adminFound, resBycrypt);
              });
            } else {
              return res.status(404).json({ 'error': 'admin not exist in DB' });
            }
          },
          function(adminFound, resBycrypt, done) {
            if(resBycrypt) {
              done(adminFound);
            } else {
              return res.status(403).json({ 'error': 'invalid password' });
            }
          }
        ], function(adminFound) {
          if (adminFound) {
            return res.status(201).json({
              'adminId': adminFound.id,
              'token': jwtUtilsAdmin.generateTokenForAdmin(adminFound),
              'adminName': adminFound.nom,
              //'imei': adminFound.imei
            });
          } else {
            return res.status(500).json({ 'error': 'cannot log on admin' });
          }
        });
    },

    logout: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var AdminId     = jwtUtilsAdmin.getAdminId(headerAuth);
      AdminId = -1;
      // Effacez le token de l'utilisateur ou effectuez d'autres actions de déconnexion nécessaires
      // delete req.user.token;
      // Ensuite, vous pouvez renvoyer une réponse appropriée, par exemple:
      return res.status(200).json({ 'message': 'user logged out successfully' });
    },
    
    getAdminProfile: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var adminId     = jwtUtilsAdmin.getAdminId(headerAuth);
        //var email      = req.body.email;
        console.log(adminId);
        //console.log(token);

        if (adminId < 0 )
        return res.status(400).json({ 'error': 'wrong token' });

        models.Admin.findOne({
            attributes: [ 'id', 'nom', 'prenom'],
            where: { id: adminId }
        }).then(function(admin) {
            if (admin) {
                res.status(201).json(admin);
            } else {
                res.status(500).json({ 'error': 'admin not found'});
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch admin'});
        });
    },
    getAllAdmins: function(req, res) {
       // Getting auth header
       var headerAuth = req.headers['authorization'];
       var AdminId     = jwtUtilsAdmin.getAdminId(headerAuth);
       console.log(AdminId);
           
 
       // Body Query Parameters
       var fields = req.query.fields;
       var limit  = parseInt(req.query.limit);
       var offset = parseInt(req.query.offset);
       var order  = req.query.order;

       if (!isAdmin) {
        return res.status(403).json({ 'error': 'Not authorized' });
      }
 
         models.Admin.findAll({
           order: [(order != null) ? order.split(':') : ['adminname', 'ASC']],
           attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
           limit: (!isNaN(limit)) ? limit : null,
           offset: (!isNaN(offset)) ? offset : null,
           //Recherche dans la BD...
           //attributes: ['adminName', 'email', 'adminType'],
           //where: { adminType: 'Dev' }
         })
         .then(function(admins) {
           if (admins) {
             res.status(200).json(admins);
           } else {
             res.status(404).json({ "error": "no admins found" });
           }
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify admin'});
         });
    },
    changePassword: function(req, res) {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtilsAdmin.getAdminId(headerAuth);
  
      // Params
      var password = req.body.password;
  
      asyncLib.waterfall([
        function(done) {
          models.Admin.findOne({
            attributes: ['id', 'password'],
            where: { id: adminId }
          }).then(function (adminFound) {
            done(null, adminFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify admin' });
          });
        },
        function(adminFound, done) {
          if(adminFound) {
            adminFound.update({
              password: (password ? password : adminFound.password)
            }).then(function() {
              done(adminFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update admin' });
            });
          } else {
            res.status(404).json({ 'error': 'admin not found' });
          }
        },
      ], function(adminFound) {
        if (adminFound) {
          return res.status(201).json(adminFound);
        } else {
          return res.status(500).json({ 'error': 'cannot update admin profile' });
        }
      });
    },
    createTypeIncident: function(req, res) {
      //Params
      var nom         = req.body.nom;
      var description = req.body.description;
      var image       = req.body.image;
      var entreprise  = req.body.entreprise;
      console.log(req.body)

      //TODO verify pseudo length, mail regex, password...
     if (nom == null || description == null) {
          return res.status(401).json({ 'error': 'missing parameters' });
          console.log("nom et description incorrectes")
      }
  
      if (nom.length >= 25 || nom.length <= 2) {
          return res.status(401).json({ 'error': 'wrong userName: must be length 2 - 25' });
          console.log("taille du nom incorrecte")
      }
  
        
        
      //WATERFALL CREATE NEW TYPEINCIDENT
      asyncLib.waterfall([
          function(done) {
              models.TypeIncident.findOne({
                  //attributes: ['nom'],
                  where: { nom: nom }
              })
              .then(function(typeIncidentFound) {
                  done(null, typeIncidentFound);
                  console.log("ok: Ticket pas encore existant en bd")
              })
              .catch(function(err) {
                  return res.status(500).json({ 'error': 'unable to verify typeIncident'});
              });
          },
          function(typeIncidentFound, done) {
              var newTypeIncident = models.TypeIncident.create({
                nom        : nom,
                image      : image,
                description: description,
                entreprise : entreprise
              })
              .then(function(newTypeIncident) {
                  done(newTypeIncident);
              })
              .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add typeIncident' });
              });
          }   
      ], function(newTypeIncident) {
          if (newTypeIncident) {
              return res.status(201).json({
                  'typeIncidentId': newTypeIncident.id,
                  'typeIncidentname': newTypeIncident.nom,
                  'typeIncidentimage': newTypeIncident.image,
                  'typeIncidentDescription': newTypeIncident.description,
              })
          } else {
              return res.status(500).json({ 'error': 'cannot add typeIncident' });
          }
      });

      /*
      models.TypeIncident.findOne({
          //Recherche dans la BD...
          //attributes: ['id', 'title', 'solution', 'description', 'userId'],
          where: { nom: nom }
      })
        .then(function(typeIncidents) {
          if (typeIncidents) {
            res.status(200).json(typeIncidents);
          } else {
            res.status(404).json({ "error": "no typeIncidents found" });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify incident'});
        });
      */
    },
    
    listTypeIncident: function (req, res) {

      // Body Query Parameters
      var fields = req.query.fields;
      var limit  = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order  = req.query.order;

        models.TypeIncident.findAll({
          order: [(order != null) ? order.split(':') : ['nom', 'ASC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          //Recherche dans la BD...
          attributes: ['nom','image', 'description'],
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

}