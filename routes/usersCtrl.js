//Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');


// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX =  /^[a-zA-Z0-9]{4,9}$/;       ///^(?=.*\d). {4,9}$/;
const TEL = /^(\+\d{1,3}\s?)?\(?\d{3}\)?[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}$/;

module.exports = {
    register: function(req, res) {

        var headerAuth = req.headers['authorization'];
        //var isAdmin     = jwtUtils.getIsAdmin(headerAuth);

        //Params
        var tel       = req.body.tel;
        var nom       = req.body.nom;
        var prenom    = req.body.prenom;
        var password  = req.body.password;
        var email     = req.body.email;
        //var isBlocked = req.body.isBlocked;
        //hasAnAccount

        //TODO verify pseudo length, mail regex, password...
        if (email == null || password == null || nom == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (nom.length >= 14 || nom.length <= 2) {
            return res.status(400).json({ 'error': 'wrong userName: must be length 3 - 14' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        /*
        if (!TEL.test(tel)) {
          return res.status(400).json({ 'error': 'phone number is not valid' });
        }
        */

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid: must length 4 - 9 and includes 1 number.' });
        }


        //WATERFALL CREATE NEW USER
        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    attributes: ['tel'],
                    where: { tel: tel }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user'});
                });
            },
            function(userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            function(userFound, bcryptedPassword, done) {
                var newUser = models.User.create({
                    tel            : tel,
                    nom            : nom,
                    prenom         : prenom,
                    password       : bcryptedPassword,
                    email          : email,
                    isBlocked      : 0
                })
                .then(function(newUser) {
                    done(newUser);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add user' });
                });
            }   
        ], function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id,
                    'nom': newUser.nom,
                    'tel': newUser.tel,
                })
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
        
    },
    login: function(req, res) {
        
        // Params
        var tel    = req.body.tel;
        var password = req.body.password;
    
        if (tel == null ||  password == null) {
          return res.status(400).json({ 'error': 'missing parameters' });
        }
    
        asyncLib.waterfall([
          function(done) {
            models.User.findOne({
              where: { tel: tel }
            })
            .then(function(userFound) {
              done(null, userFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify user' });
            });
          },
          function(userFound, done) {
            if (userFound) {
              bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              });
            } else {
              return res.status(404).json({ 'error': 'user not exist in DB' });
            }
          },
          function(userFound, resBycrypt, done) {
            if(resBycrypt) {
              done(userFound);
            } else {
              return res.status(403).json({ 'error': 'invalid password' });
            }
          }
        ], function(userFound) {
          if (userFound) {
            return res.status(201).json({
              'userId': userFound.id,
              'token': jwtUtils.generateTokenForUser(userFound),
              'isBlocked': userFound.isBlocked,
              'tel': userFound.tel
            });
          } else {
            return res.status(500).json({ 'error': 'cannot log on user' });
          }
        });
    },

    logout: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var UserId     = jwtUtils.getUserId(headerAuth);
      UserId = -1;
      // Effacez le token de l'utilisateur ou effectuez d'autres actions de déconnexion nécessaires
      // delete req.user.token;
      // Ensuite, vous pouvez renvoyer une réponse appropriée, par exemple:
      console.log(jwtUtils.getUserId(headerAuth));
      return res.status(200).json({ 'message': 'user logged out successfully' });
      
    },

    
    getUserProfile: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId     = jwtUtils.getUserId(headerAuth);
        //var email      = req.body.email;
        console.log(userId);
        //console.log(token);

        if (userId < 0 )
        return res.status(400).json({ 'error': 'wrong token' });

        models.User.findOne({
            attributes: [ 'id', 'email', 'nom', 'tel'],
            where: { id: userId }
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
    getAllUsers: function(req, res) {
       // Getting auth header
       var headerAuth = req.headers['authorization'];
       var UserId     = jwtUtils.getUserId(headerAuth);
       console.log(UserId);
           
 
       // Body Query Parameters
       var fields = req.query.fields;
       var limit  = parseInt(req.query.limit);
       var offset = parseInt(req.query.offset);
       var order  = req.query.order;

       //if (!isAdmin) { return res.status(403).json({ 'error': 'Not authorized' }); }
 
         models.User.findAll({
           order: [(order != null) ? order.split(':') : ['nom', 'ASC']],
           attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
           limit: (!isNaN(limit)) ? limit : null,
           offset: (!isNaN(offset)) ? offset : null,
           //Recherche dans la BD...
           attributes: ['id', 'nom', 'email', 'tel'],
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
    changePassword: function(req, res) {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var userId      = jwtUtils.getUserId(headerAuth);
  
      // Params
      var password = req.body.password;
  
      asyncLib.waterfall([
        function(done) {
          models.User.findOne({
            attributes: ['id', 'password'],
            where: { id: userId }
          }).then(function (userFound) {
            done(null, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if(userFound) {
            userFound.update({
              password: (password ? password : userFound.password)
            }).then(function() {
              done(userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user' });
            });
          } else {
            res.status(404).json({ 'error': 'user not found' });
          }
        },
      ], function(userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ 'error': 'cannot update user profile' });
        }
      });
    },
    getUser: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      //var userId     = jwtUtils.getUserId(headerAuth);
      //var email      = req.body.email;
      var userId      = req.query.userId;
      console.log(userId);
      //console.log(token);

      if (userId < 0 )
      return res.status(400).json({ 'error': 'wrong token' });

      models.User.findOne({
          attributes: [ 'id', 'email', 'nom', 'tel'],
          where: { id: userId }
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
    deleteUser: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var id = req.query.id;
      //var userId     = jwtUtils.getUserId(headerAuth);


      console.log(id);

      //if (userId < 0 ) return res.status(400).json({ 'error': 'wrong token' });

      asyncLib.waterfall([
        function(done) {
          models.User.findOne({
            where: { id: id }
          }).then(function (userFound) {
            done(null, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if(userFound) {
            userFound.destroy().then(function() {
              done(null, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot delete user' });
            });
          } else {
            res.status(404).json({ 'error': 'user not found' });
          }
        },
      ], function(err, userFound) {
        if (!err && userFound) {
          return res.status(200).json({ 'message': 'user deleted successfully' });
        } else {
          return res.status(500).json({ 'error': 'cannot delete user' });
        }
      });
      
      
    },
    blockUser: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var id    = req.query.id;
  
      asyncLib.waterfall([
        function(done) {
          models.User.findOne({
            where: { id: id }
          })
          .then(function(userFound) {
            done(null, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if (userFound) {
                models.User.update(  {
                  isBlocked: 1
                },
                {
                  where: { id: id }
                }
                ).then(function() {
                  models.User.findByPk(id).then(function(newUser) {
                    return res.status(201).json(newUser);
                  });
                });
          } else {
            return res.status(404).json({ 'error': 'user not exist in DB' });
          }
        }
      ], function(userFound) {
        if (userFound) {
          return res.status(201).json({
            'userId': userFound.id,
            'isBlocked': userFound.isBlocked,
          });
        } else {
          return res.status(500).json({ 'error': 'cannot log on user' });
        }
      });
    },
    

/*
const express = require("express");
const jwt = require("express-jwt");
const mysql = require("mysql2");

const app = express();

app.use(jwt({
  secret: "YOUR_SECRET_KEY",
}));

app.get("/phone", (req, res) => {
  // Vérifiez l'authentification de l'utilisateur
  if (!req.user) {
    res.status(401).send("Vous n'êtes pas authentifié.");
    return;
  }

  // Obtenez l'ID de l'utilisateur
  const userId = req.user.id;

  // Connectez-vous à la base de données
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "database_name",
  });

  // Exécutez la requête SQL pour récupérer le numéro de téléphone
  connection.query(`
    SELECT phone_number
    FROM users
    WHERE id = ${userId}
  `, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    // Envoyez la réponse
    res.json(results[0].phone_number);
  });
});

app.listen(3000);

*/


}