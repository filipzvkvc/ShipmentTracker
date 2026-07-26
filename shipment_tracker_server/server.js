const app = require('./app');
const connectToDatabase = app.connectToDatabase;
const SETTINGS = require('./Settings');

const PORT = process.env.PORT || 4003;
console.log("Port: ", PORT);
console.log("Hello");

let server;

connectToDatabase( (  ) => server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold) ) );

process.on('unhandledRejection', (err, promise) => {
  console.log("Error:".red , err.message);
  // Close server & exit proces
  if(! SETTINGS.UNHANDLED_REJECTION_PROMISE_DOESNT_EXIT){        
    server.close(() => process.exit(1));
  }  
});

/// Important: before using create user in database to match specified credentials in ./config/config.js and ./config/config.env
/*
mysql (as root):
    CREATE USER 'shipment_tracker' IDENTIFIED BY 'shipment_tracker';
    GRANT ALL ON shipment_tracker_db.* TO 'shipment_tracker';
    GRANT ALL ON shipment_tracker_db_test.* TO 'shipment_tracker';
    
*/
