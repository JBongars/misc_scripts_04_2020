

const getEnvVariables = (document) => {
  const _getEnvEntries = (document) => Array.from(document["$ctrl.form"]).map(elem => elem.value);
  const _convertArrayToObject = arr => {
    let result = {};
  
    arr.forEach((elem, i) => {
      if(/[A-Z_]+/.test(elem)){
        key = elem;
        return;
      }
      result[key] = elem;
      return;
    });

    return result;
  }
  console.log(_getEnvEntries(document));
  return _convertArrayToObject(_getEnvEntries(document).filter(elem => Boolean(elem)));
}

getEnvVariables(document);
