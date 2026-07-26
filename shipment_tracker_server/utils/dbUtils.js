function selectAttributes( attributesArray ){
  return {
    attributes : attributesArray
  }
}

function selectAllAttributesExcept( excludeAttrArray ){
  return {
    attributes : {
      exclude : excludeAttrArray
    }
  }
}

module.exports = {
  selectAttributes,
  selectAllAttributesExcept
}