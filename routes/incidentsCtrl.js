// Imports
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
var jwtUtilsAdmin = require('../utils/jwt.utils.admin');
var jwtUtilsEntreprise = require('../utils/jwt.utils.entreprise');

module.exports ={
    createIncident: function (req, res) {
      var headerAuth = req.headers['authorization'];
      var userId     = jwtUtils.getUserId(headerAuth);
      var isBlocked     = jwtUtils.getIsBlocked(headerAuth);

      // Params
      var title       = req.body.title;
      var type        = req.body.type;
      var media       = req.body.media;
      var audio       = req.body.audio;
      var gravite     = req.body.gravite;
      var description = req.body.description;
      var localisation= req.body.localisation;
      var etat        = req.body.etat;

      if (!title || !description) {
          return res.status(400).json({ 'error': 'missing parameters'});
      }

      if (gravite != 1  && gravite != 2 && gravite != 3 && gravite != 4 && gravite != 5) {
          return res.status(400).json({ 'error': 'invalid level of disturb'});
      }

    asyncLib.waterfall([
        function(done) {
            if(userId) {
                models.User.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
            } else {
                done(null, null);
            }
        },
        function(userFound, done) {
            if(userFound && isBlocked == 0) {
                models.Incident.create({
                    title      : title,                   
                    tel        : userId,
                    type       : 2,
                    media      : media,
                    audio      : audio,
                    gravite    : gravite,
                    description: description,
                    localisation   : localisation,
                    etat        : 'created',
                })
                .then(function(newIncident) {
                    done(newIncident);
                });
            }
        },
    ],  function(newIncident) {
        if (newIncident) {
            return res.status(201).json(newIncident);
        } else {
            return res.status(500).json({ 'error': 'cannot post Incident' });
        }
    });
    },
    listIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var AdminId    = jwtUtilsAdmin.getAdminId(headerAuth);
      console.log(AdminId);
      var UserId     = jwtUtils.getUserId(headerAuth);
      console.log(UserId);
      var EntrepriseId     = jwtUtilsEntreprise.getEntrepriseId(headerAuth);
          

      // Body Query Parameters
      var fields = req.query.fields;
      var limit  = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order  = req.query.order;

      if (UserId) {
        // Le user est un client.

        models.Incident.findAll({
          order: [(order != null) ? order.split(':') : ['title', 'ASC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          //Recherche dans la BD...
          //attributes: ['id', 'title', 'solution', 'description', 'userId'],
          where: { tel: UserId }
        })
        .then(function(incidents) {
          if (incidents) {
            res.status(200).json(incidents);
          } else {
            res.status(404).json({ "error": "no incidents found" });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify incident'});
        });
      } 
      else {
        
        if (!UserId && EntrepriseId) {
          //L'utilisateur est une entreprise'
          
          models.Incident.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            //Recherche dans la BD.
            //attributes: ['id', 'title', 'solution', 'description', 'state', 'userId', 'file', 'allowedUsers'],
            where: { type: UserId  }
          })
          .then(function(incidents) {
            if (incidents) {
              res.status(200).json(incidents);
            } else {
              res.status(404).json({ "error": "no incidents found" });
            }
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify incident'});
          });
        } 
        
        else {
          
          if (!UserId && !EntrepriseId && AdminId) {
            //Le user est un Administrateur
            
            models.Incident.findAll({
              order: [(order != null) ? order.split(':') : ['title', 'ASC']],
              attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
              limit: (!isNaN(limit)) ? limit : null,
              offset: (!isNaN(offset)) ? offset : null,
              //Recherche dans la BD.
              //attributes: ['id', 'title', 'solution', 'description', 'userId', 'file', 'userId'],
              //where: { userId: allowedUsers } 
            })
            .then(function(incidents) {
              if (incidents) {
                res.status(200).json(incidents);
              } else {
                res.status(404).json({ "error": "no incidents found" });
              }
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify user'});
            });
          }
        }
      }

      
    },
    searchIncident: function(req, res) {
      

      
    },
    updateIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var isAdmin    = jwtUtils.getIsAdmin(headerAuth);
      console.log(isAdmin);
      var UserId     = jwtUtils.getUserId(headerAuth);
      console.log(UserId);
      var UserType   = jwtUtils.getUserType(headerAuth);
      console.log(UserType);
          

      // Body Query Parameters
      var fields = req.query.fields;
      var limit  = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order  = req.query.order;

      if (UserType == 'Client') {
        // Le user est un client.

        models.Incident.findAll({
          order: [(order != null) ? order.split(':') : ['title', 'ASC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          //Recherche dans la BD...
          //attributes: ['id', 'title', 'solution', 'description', 'userId'],
          where: { userId: UserId }
        })
        .then(function(incidents) {
          if (incidents) {
            res.status(200).json(incidents);
          } else {
            res.status(404).json({ "error": "no incidents found" });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify incident'});
        });
      } 
      
      else {
        
        if (UserType != 'Client' && UserType == 'Dev') {
          //Le user est un développeur
          
          models.Incident.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            //Recherche dans la BD.
            //attributes: ['id', 'title', 'solution', 'description', 'state', 'userId', 'file', 'allowedUsers'],
            where: { allowedUsers: UserId  }
          })
          .then(function(incidents) {
            if (incidents) {
              res.status(200).json(incidents);
            } else {
              res.status(404).json({ "error": "no incidents found" });
            }
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify incident'});
          });
        } 
        
        else {
          
          if (UserType != 'Client' && UserType != 'Dev' && UserType == 'Admin') {
            //Le user est un Administrateur
            
            models.Incident.findAll({
              order: [(order != null) ? order.split(':') : ['title', 'ASC']],
              attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
              limit: (!isNaN(limit)) ? limit : null,
              offset: (!isNaN(offset)) ? offset : null,
              //Recherche dans la BD.
              //attributes: ['id', 'title', 'solution', 'description', 'userId', 'file', 'userId'],
              //where: { userId: allowedUsers } 
            })
            .then(function(incidents) {
              if (incidents) {
                res.status(200).json(incidents);
              } else {
                res.status(404).json({ "error": "no incidents found" });
              }
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify user'});
            });
          }
        }
      }

      
    },
    deleteIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var isAdmin     = jwtUtils.getIsAdmin(headerAuth);
      console.log(isAdmin);
      var userId   = jwtUtils.getUserId(headerAuth);
      var userType   = jwtUtils.getUserType(headerAuth);
      console.log(userType);
      var id     = req.query.id;

      const incident     = models.Incident.findByPk(id);
      const user       = models.User.findByPk(userId);

      if (isNaN(id)) {
        return res.status(500).json({ message: 'Incident id not found' });
      }
      else if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      } 
      else {
        if (incident && !user) {
          return res.status(404).json({ message: 'User not found' });
        } 
        else  {
           { 
            models.User.findOne({ 
              attributes: ['userType'],
              where: { id: userId } 
            })
            .then(function(userFound) {
              if (userFound && (userFound.userType)) {
                models.Incident.delete(
                  //{ state: newState }, 
                  { where: { id: id } }
                ).then(function() {
                  models.Incident.findByPk(id).then(function(incident) {
                    return res.status(204).json(incident);
                  });
                });
              }
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'cannot delete Incident'});
            });   
          } 
        } 
      }
      
    },
    assignIncident: function(req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var isAdmin     = jwtUtils.getIsAdmin(headerAuth);
    console.log(isAdmin);
    var UserType   = jwtUtils.getUserType(headerAuth);
    console.log(UserType);
    var id     = req.query.id;
    var userId       = req.body.userId;
    
    const incident     = models.Incident.findByPk(id);
    const user       = models.User.findByPk(userId);
    
    if (isNaN(id)) {
      return res.status(500).json({ message: 'Incident id not found' });
    }
    else if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    } 
    else {
      if (incident && !user) {
        return res.status(404).json({ message: 'User not found' });
      } 
      else  {
        if (incident && user && !isAdmin) {
          return res.status(403).json({ message: 'Unauthorized. You are not admin.' });
        }
        else  { 
          models.User.findOne({ 
            attributes: ['userType'],
            where: { id: userId } 
          })
          .then(function(userFound) {
            if (userFound && userFound.userType == 'company') {
              models.Incident.update(
                { idCompany: userId }, 
                {where: { id: id } }
              ).then(function() {
                models.Incident.findByPk(id).then(function(newIncident) {
                  return res.status(201).json(newIncident);
                });
              });
            } else {
                return res.status(404).json({ 'error': 'user not exist in DB or not eligible'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'cannot post Incident'});
        });   
      } } }
    },
    getIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      //var userId     = jwtUtils.getUserId(headerAuth);
      //var token      = jwtUtils.parseAuthorization(headerAuth);
      var id      = req.query.id;
      console.log(userId);
      //console.log(token);

      //if (userId < 0 ) return res.status(400).json({ 'error': 'wrong token' });

      models.Incident.findOne({
          //attributes: ['title', 'description','type','etat','localisation','media','gravite'],
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
    updateIncidentEtat: function (req, res) {

      // Getting auth header
      var headerAuth = req.headers['authorization'];
      //var isAdmin     = jwtUtils.getIsAdmin(headerAuth);
      console.log(isAdmin);
      //var UserId   = jwtUtils.getUserId(headerAuth); //id du user courant
      //var UserType   = jwtUtils.getUserType(headerAuth); //userType du user courant
      
      var etat     = req.body.etat;
      var id       = req.query.id;
      
      const incident     = models.Incident.findByPk(id); //incident sélectionné
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      } 
      else {
            models.Incident.findOne({ 
              attributes: ['etat'],
              where: { id: id } 
            })
            .then(function(userFound) {
              if (userFound) {
                models.Incident.update(
                  { etat: etat }, 
                    {where: 
                      { 
                      id: id 
                      } 
                    }
                ).then(function() {
                  models.Incident.findByPk(incidentId).then(function(newIncident) {
                    return res.status(201).json(newIncident);
                  });
                });
              } else {
                  return res.status(404).json({ 'error': 'user not exist in DB or not eligible'});
              }
          })
          .catch(function(err) {
              return res.status(500).json({ 'error': 'cannot post Incident'});
          }
          );
        }
      },

}