const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//var path = __dirname + '/app/views/'; // this folder should contain your html files.
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets handlebars configurations (we will go through them later on)
app.use(express.static('public'))

app.set('views',        __dirname+'/views/');
app.set('view engine', 'hbs');
//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    //new configuration parameter
    extname: 'hbs'
}));



app.get('/', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', {layout : 'index'});
    });

// simple route
/*app.get("/", (req, res) => {
  //res.json({ message: "Welcome to bezkoder application." });
  res.sendFile(path + 'index.html');
});*/

require("./routes/radiobase.routes.js")(app);

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});