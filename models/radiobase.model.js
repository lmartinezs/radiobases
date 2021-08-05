const sql = require("./db.js");

// constructor
const Radiobase = function(radiobase) {
    this.radiobase = radiobase.radiobase;
    this.fecha = radiobase.fecha;
    this.region = radiobase.region;
    this.trafico = radiobase.trafico;
  };

Radiobase.create = (newRadiobase, result) => {
    sql.query("INSERT INTO radiobases SET ?", newRadiobase, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created radiobase: ", { id: res.insertId, ...newRadiobase });
      result(null, { id: res.insertId, ...newRadiobase });
    });
  };

  Radiobase.getRegions = result => {
    sql.query(`select distinct(region) from radiobases order by region ASC;`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("regions: ", res);
      result(null, res);
    });
  };
  Radiobase.getDates = result => {
    sql.query(`select distinct(fecha) from radiobases order by fecha asc;`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      //console.log("fechas: ", res);
      result(null, res);
    });
  };
  
  Radiobase.findById = (radiobaseId, region, result) => {
    sql.query(`SELECT * FROM radiobases WHERE radiobase = '${radiobaseId}' and region = '${region}' `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found radiobase: ", res);
        result(null, res);
        return;
      }
  
      // not found Radiobase with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Radiobase.getAll = (regionId, result)  => {
    sql.query(`select * from radiobases where region= '${regionId}' order by radiobase,fecha asc limit 1000`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("radiobases: ", res);
      result(null, res);
    });
  };

  Radiobase.getCompleteAll = result  => {
    sql.query(`select * from radiobases order by radiobase,fecha asc limit 10000`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("radiobases: ", res);
      result(null, res);
    });
  };
  
  Radiobase.updateById = (id, radiobase, result) => {
    sql.query(
      "UPDATE radiobases SET email = ?, name = ?, active = ? WHERE id = ?",
      [radiobase.email, radiobase.name, radiobase.active, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Radiobase with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated radiobase: ", { id: id, ...radiobase });
        result(null, { id: id, ...radiobase });
      }
    );
  };
  
  Radiobase.remove = (id, result) => {
    sql.query("DELETE FROM radiobases WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Radiobase with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted radiobase with id: ", id);
      result(null, res);
    });
  };
  
  Radiobase.removeAll = result => {
    sql.query("DELETE FROM radiobases", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} radiobases`);
      result(null, res);
    });
  };
  
  module.exports = Radiobase;