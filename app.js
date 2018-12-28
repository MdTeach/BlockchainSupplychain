const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from /public
app.use(express.static(__dirname + '/public'));

//Using pug as template engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
const routes = require('./routes/index');
app.use('/', routes);



//Deploying the server
app.listen(80,'192.168.100.34',() => {
    console.log('The application is running on localhost:80')
});