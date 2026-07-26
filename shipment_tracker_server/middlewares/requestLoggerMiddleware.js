const { isNotEmptyObj } = require('../utils/utils')

module.exports = (req, res, next) => {
  const { method, originalUrl, params, query, body } = req;
  console.log();
  console.log(method, originalUrl);
  if(params != null && isNotEmptyObj(params) ){
    let tempParams = {...params}
    delete tempParams['0'];
    if(isNotEmptyObj(tempParams) ){
      console.log("Params: ");
      console.log(tempParams)
    }
  }
  if(query != null && isNotEmptyObj(query) ){
    console.log("Query: ");
    console.log(query);
  }
  if(body != null && isNotEmptyObj(query) ){
    console.log("Body: ");
    console.log(body);
  }

  next();
}