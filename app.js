if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

let express = require('express');
let app = express();
let nodemon = require('nodemon');
let session = require('express-session');
let router = require('./Routes/routes');
let sessionConfig = require('./DB-Connect/connect-db');
let port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set("port",port);
app.use(session(sessionConfig));

app.use('/api',router);

// port = Math.floor(Math.random()*8976+1024);
app.listen(3000,()=> {
    console.log("The server is connected to 3000");
});
