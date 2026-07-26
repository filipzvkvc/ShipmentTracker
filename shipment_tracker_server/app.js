const express = require('express');
require('mysql2');
const db = require('./config/database');
const path = require('path');
const modelSyncer = require('./utils/modelSyncer');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const cors = require('cors');

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const bodyParser = require('body-parser');
const SETTINGS = require('./Settings');

const app = express();
 

app.use(cors({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(SETTINGS.LOG_REQUESTS_TO_CONSOLE) {  
  app.use('*', require('./middlewares/requestLoggerMiddleware') );
  console.log("Request logger middleware mounted");
}


app.get('/', (req, res) => {res.send('Server is running')})

app.use('/test', require('./routes/testRoute') );

app.use('/v1', require('./routes/v1Routes') );

app.use( require('./errorMiddlewares/baseErrorMiddleware').baseErrorMiddleware );
app.use( require('./errorMiddlewares/catchAllErrorMiddleware').catchAllErrorMiddleware );



async function connectToDatabase( onConnectCallback) {
  return db.authenticate()
  //.then(() => console.log('Database connected...'.blue.bold))
  .then( () => {console.log("Connection has been established successfully.".blue)})
  .then( () => modelSyncer(db) )      
  .then( () => Promise.resolve(true) )  
  .catch(err => { console.log("Unable to connect to database: ".red , err); return false; })    
  .then( connectionResult => connectionResult ? onConnectCallback() : process.exit(1) )  
}

app.connectToDatabase = connectToDatabase;
module.exports = app;
