const Radiobase = require("../models/radiobase.model.js");
const Utils = require("../utils/utils.js");
const controller = require("./radiobase.controller.js");

const config = require("../config/config.js");
var regionStatic = require('../utils/regionHelper.js');

// Create and Save a new Radiobase
exports.create = (req, res) => {
  
};

exports.setRegion = async (req, res) => {
  
  regionStatic.setRegion(req.params.regionId)
  res.send(regionStatic.getRegion());
};

// Retrieve all Radiobases from the database.
exports.findAll = async (req, res) => {
    let dates = [];
    let regions = []; 
    let selectedRegion = 1;   
    try {
      dates = await exports.getArrayDates();
      regions = await exports.getRegions();
    }
    catch( err ) {
        console.log("Error occured in one of the API call: ", err);
    };
    Radiobase.getAll(regionStatic.getRegion(), (err, data) => {
        if (err){
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving radiobases."
          });
        } else{ 

          var Radiobases = Utils.convertByProperty(data, 'radiobase', 'region');

          /*Radiobases.forEach(radio => { 
            console.log(radio.radiobase);
          });*/

          res.render('radiobases', {layout : 'index', radioBases: Radiobases, listExists: true, config:config,fechas:dates,regions:regions,selectedRegion: selectedRegion});

          //console.log(data);
          //res.send(Radiobases);
        }
      });
  
};

exports.getRegions = (req, res) => {
  return new Promise ( (resolve, reject) => {
    Radiobase.getRegions((err, data) => {
        if (err)
          reject(err);
        else{ 
          let regions = [];
          data.forEach(region => {               
            region.selected = (region.region == regionStatic.getRegion())? 'selected' : '';
            regions.push(region); 
          });
          resolve(regions);   
        } 
      });
  });
};

exports.getArrayDates  = (req, re) => {
  return new Promise ( (resolve, reject) => {

    Radiobase.getDates((err, data) => {
      if (err)
        reject(err);
      else{        
        resolve( Utils.getArrayDates(data) );   
      } 
      
    });
  });
};

// Find a single Radiobase with a radiobaseId
exports.findOne = async (req, res) => { 
  let dates = [];
  let regions = [];
  try {
    dates = await exports.getArrayDates();
    regions = await exports.getRegions();
  }
  catch( err ) {
      console.log("Error occured in one of the API call: ", err);
  };
    Radiobase.findById (req.params.radiobaseId, regionStatic.getRegion(), (err, data) => {
      
        if (err) {
          if (err.kind === "not_found") {
            message = `Not found Radiobase with id ${req.params.radiobaseId}.`;
            res.status(404).render('errorpage', {layout : 'index', message});
            /*res.status(404).send({
              message: `Not found Radiobase with id ${req.params.radiobaseId}.`              
            });*/
          } else {
            res.status(500).send({
              message: "Error retrieving Radiobase with id " + req.params.radiobaseId
            });
          }
        } else {
          //var tes = exports.getArrayDates();
       
            var items = [];            
/*
            for (var i = 0; i < dates.length; i++) {   

                var item = [];
                data.forEach(radiobase => {  
                  //console.log("fecha: " +dates[i].date);
                  //console.log("fechadelropw: " +radiobase.fecha );
                  if(radiobase.fecha.getTime() === dates[i].date.getTime() ){  
                    radiobase.class = Utils.getTrafficClass(radiobase.trafico);              
                    radiobase.date = Utils.getHumanDate(radiobase.fecha);
                    items.push(radiobase);                                        
                  }
                });               
            }*/
            console.log(regions);

            data.forEach(radiobase => {     

              radiobase.class = Utils.getTrafficClass(radiobase.trafico);
              
              radiobase.date = Utils.getHumanDate(radiobase.fecha);
              //console.log(radiobase.fecha);
              //console.log(dates);
              //let obj = dates.find(o => o.date === radiobase.fecha);
              //if (Object.values(dates).indexOf(radiobase.fecha) > -1) {
              //  console.log('has ' + radiobase.fecha);
              //}
              //console.log(obj);              
              items.push(radiobase);              
              //radiobase.date = day +'-'+ monthNames[d.getMonth()];
              
            });  
            //console.log(items);            
            res.render('radiobasedetail', {layout : 'index', radiobaseId:req.params.radiobaseId, radioBases: items, listExists: true, config:config, fechas:dates, regions:regions});
        }
        
        
        
      });
};

// Update a Radiobase identified by the radiobaseId in the request
exports.update = (req, res) => {
   // Validate Request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Radiobase.updateById(
    req.params.radiobaseId,
    new Radiobase(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Radiobase with id ${req.params.radiobaseId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Radiobase with id " + req.params.radiobaseId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Radiobase with the specified radiobaseId in the request
exports.delete = (req, res) => {
    Radiobase.remove(req.params.radiobaseId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Radiobase with id ${req.params.radiobaseId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Radiobase with id " + req.params.radiobaseId
            });
          }
        } else res.send({ message: `Radiobase was deleted successfully!` });
      });
};

// Delete all Radiobases from the database.
exports.deleteAll = (req, res) => {
    Radiobase.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all radiobases."
          });
        else res.send({ message: `All Radiobases were deleted successfully!` });
      });
};