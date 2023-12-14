//Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');var jwtUtils = require('../utils/jwt.utils');
var jwtUtilsAdmin = require('../utils/jwt.utils.admin');
var jwtUtilsEntreprise = require('../utils/jwt.utils.entreprise');


module.exports = {
    createTypeIncident: function(req, res) {
        //Params
        var nom        = req.body.nom;
        var description = req.body.description;
        var entreprise        = req.body.entreprise;

        //TODO verify pseudo length, mail regex, password...
        if (nom == null || description == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
    
        if (nom.length >= 25 || nom.length <= 2) {
            return res.status(400).json({ 'error': 'wrong userName: must be length 2 - 25' });
        }
    
        //CREATE NEW INCIDENT
        models.TypeIncident.create({
          nom        : nom,
          description: description,
          entreprise : entreprise
        }).then(function(typeIncidents) {
          if (typeIncidents) {
              res.status(201).json(typeIncidents);
          } else {
              res.status(404).json({ "error": "no type of incidents found" });
          }
          }).catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify type of incident'});
          });
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
          attributes: ['nom', 'description'],
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
        attributes: ['nom','description'],
          where: whereCondition
      }).then(function(typeIncidents) {
          if (typeIncidents) {
              res.status(200).json(typeIncidents);
          } else {
              res.status(404).json({ "error": "no type of incidents found" });
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