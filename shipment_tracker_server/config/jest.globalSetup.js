const db = require('./database');
const modelSyncer = require('../utils/modelSyncer');  

module.exports = async function() {
  global.__testDb = db;
  return db.authenticate()
  //.then(() => console.log('Database connected...'.blue.bold))
  .then(() => {console.log("Connection has been established successfully.".blue)})  
  .then( modelSyncer(db) )
  .catch(err => { console.log("Unable to connect to database: ".red , err); process.exit(1) })

}