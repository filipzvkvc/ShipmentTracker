const fs = require('fs');
const upperCamelCase = require('uppercamelcase');


const DIR_PATH = './models'

async function loadModels(path) {
  const dir = await fs.promises.opendir(path);
  const modelsArray = [];
  for await (const dirent of dir) {        
    const tempDirentName = dirent.name;
    if( dirent.isFile() && tempDirentName.endsWith('.js') && tempDirentName !== "index.js" ){
      modelsArray.push(
        require(
          `${DIR_PATH}/${upperCamelCase(tempDirentName.substring(0,tempDirentName.length - 3))}`) )
    }        
  }    
  return modelsArray;
}

module.exports = async function ( db ) {
  loadModels( DIR_PATH ).catch(console.error);  
  return db.sync()
            .then( () => console.log("Models synced") )
            .catch(  err => { console.error("Error syncing models" ); console.error(err) } )
}
