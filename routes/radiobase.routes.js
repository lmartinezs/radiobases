module.exports = app => {
    const radiobases = require("../controllers/radiobase.controller.js");
        
    // Create a new Radiobase
    app.post("/radiobases", radiobases.create);
  
    // Retrieve all Radiobases
    app.get("/radiobases", radiobases.findAll);

    app.get("/radiobases/regions", radiobases.getRegions);
  
    // Retrieve a single Radiobase with radiobaseId
    app.get("/radiobases/:radiobaseId", radiobases.findOne);

    app.get("/region/:regionId", radiobases.setRegion);
  
    // Update a Radiobase with radiobaseId
    app.put("/radiobases/:radiobaseId", radiobases.update);
  
    // Delete a Radiobase with radiobaseId
    app.delete("/radiobases/:radiobaseId", radiobases.delete);
  
    // Create a new Radiobase
    app.delete("/radiobases", radiobases.deleteAll);
  };