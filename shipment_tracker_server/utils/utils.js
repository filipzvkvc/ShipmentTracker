function isUndefined(arg){
    return typeof arg === 'undefined';
}

function isUndefinedOrNull(arg){
    return typeof arg === 'undefined' || arg === null;
}

function isDefined(arg){
    return typeof arg !== 'undefined';
}

function isDefinedAndNotNull(arg){
    return typeof arg !== 'undefined' && arg !== null;
}

function isEmptyObj( argObj ){
    return Object.keys(argObj).length === 0 && argObj.constructor === Object;
}

function isNotEmptyObj( argObj ){
    return ! (Object.keys(argObj).length === 0 && argObj.constructor === Object);
}

function extractErrorMsg( error ){
    return error.details.map( detail => detail.message).join('\n');
}

function getFormatedDateTimeString(argDate) {
    return argDate.toLocaleString() + ` (${argDate.getTime()})`
}

function generateAlternativeRegexStringFromObjValues( argObj ){
  let objValues = Object.values(argObj);
  let result = objValues
                .reduce( (acc, next, index) => {
                  if(index < objValues.length - 1){
                    return acc += `${next}|`
                  }else {
                    return acc += String(next);
                  }
                }, "");
  result = `^(${result})$`
  
  return result;
}

function extractMinAndMaxFromObjValues(obj){
  let tempValues = Object.values(obj)
  return {
    min : Math.min(...tempValues),
    max : Math.max(...tempValues)
  }
}

function catchErrors( argHandler){
  return function (req, res, next){
    try {
      const result = argHandler(req, res, next);      
      if( result instanceof Promise) result.catch(next);
      return result;
    }catch(error){
      next(error);
    }      
  }
}

module.exports = {
  isUndefined,
  isDefined,
  isEmptyObj,  
  isNotEmptyObj,
  isDefinedAndNotNull,
  isUndefinedOrNull,
  getFormatedDateTimeString,
  extractErrorMsg,
  generateAlternativeRegexStringFromObjValues,
  extractMinAndMaxFromObjValues,
  catchErrors
}