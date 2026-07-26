export default function buildFakeDataSource( dataArray, idKey, wrapInData){
  let data = [...dataArray];

  async function patchOne( argId, argNewObj){
    // console.log("Patch one - user id", argId)
    let tempItemIndex = data.findIndex( item => item[idKey] === argId)
    if(tempItemIndex !== -1){
      data[tempItemIndex] = { ...data[tempItemIndex], ...argNewObj}
      return Promise.resolve()
    }else {
      return Promise.reject(new Error("Update One - Not found") );
    }  
  }

  async function getAll( ) {
    return Promise.resolve( wrapInData ? { data : {...data} } : { ...data} );
  }

  async function getOne( argId){    
    let tempItem = data.find( item => item[idKey] === argId)    
    
    if(tempItem != null){
      return Promise.resolve( wrapInData ? { data : { ...tempItem} } : { ...tempItem} )
    }else {
      return Promise.reject(new Error("Get One - Not found") );
    }
  }

  async function post( argArray ){
    if( data.some( dataEl => argArray.some( el=> dataEl[idKey] === el[idKey])) ){
      return Promise.reject("Post - Duplicate primary keys")
    }else {
      data = [...data, ...argArray];
      return Promise.resolve();
    }    
  }

  async function deleteOne( argId){
    let tempItemIndex = data.findIndex( item => item[idKey] === argId)
    if(tempItemIndex !== -1){      
      let tempData = data;
      data = [ ...tempData.slice(0,tempItemIndex), ...tempData.slice(tempItemIndex + 1) ];
      return Promise.resolve()
    }else {
      return Promise.reject(new Error("Delete One - Not found") );
    }  
  }

  return {
    patchOne,
    getAll,
    getOne,
    post,
    deleteOne,
  }
}