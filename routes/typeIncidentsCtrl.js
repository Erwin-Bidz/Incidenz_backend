//Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
var jwtUtilsAdmin = require('../utils/jwt.utils.admin');
var jwtUtilsEntreprise = require('../utils/jwt.utils.entreprise');


module.exports = {
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
          //attributes: ['nom', 'description'],
          //where: { userType: 'Dev' }
        })
        .then(function(typeIncidents) {
          if (typeIncidents) {
            res.status(200).json(typeIncidents);
          } else {
            res.status(404).json({ "error": "no typeIncidents found" });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify typeIncident'});
        });
      
    },
    searchTypeIncident: function (req, res) {
      const { Op } = require("sequelize");

      var headerAuth = req.headers['authorization'];
      //var UserId = jwtUtils.getUserId(headerAuth);
      var nom = req.query.nom;

      //Le user courant
      //const user       = models.User.findByPk(UserId);
  
      // Ecrire la condition de recherche
      var whereCondition = {
        nom: {
          [Op.like]: '%' + nom + '%'
        }
      };
                          
      models.TypeIncident.findAll({
        attributes: ['id', 'nom','image', 'description'],
          where: whereCondition
      }).then(function(typeIncidents) {
          if (typeIncidents) {
              res.status(200).json(typeIncidents);
          } else {
              res.status(404).json({ "error": "no type of typeIncidents found" });
          }
      }).catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify type of incident'});
      });
    },
    getTypeIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      //var userId     = jwtUtils.getUserId(headerAuth);
      //var token      = jwtUtils.parseAuthorization(headerAuth);
      var id      = req.query.id;
      console.log(id);
      //console.log(token);

      //if (userId < 0 ) return res.status(400).json({ 'error': 'wrong token' });

      models.TypeIncident.findOne({
          attributes: ['id', 'nom', 'image','description'],
          where: { id: id }
      }).then(function(typeIncident) {
          if (typeIncident) {
              res.status(201).json(typeIncident);
          } else {
              res.status(500).json({ 'error': 'typeIncident not found'});
          }
      }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot fetch typeIncident'});
      });
    },
    deleteTypeIncident: function(req, res) {
      // Getting auth header
      var headerAuth = req.headers['authorization'];
      var userId     = jwtUtils.getUserId(headerAuth);
      //var token      = jwtUtils.parseAuthorization(headerAuth);
      var id      = req.query.id;
      console.log(userId);
      //console.log(token);

      //if (userId < 0 ) return res.status(400).json({ 'error': 'wrong token' });

      models.TypeIncident.findOne({
          attributes: ['nom', 'description'],
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