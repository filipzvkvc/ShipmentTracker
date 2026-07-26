module.exports = async function() {  
  return await global.__testDb.close();  
}