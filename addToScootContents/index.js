

const fs = require('fs');
const scootContents = require('./scootContents.json');

const supportMessage = `<p>Wuhan Coronavirus Outbreak and Hong Kong Protests: Information for Scootsurance customers <a href=\"https://www.axa.com.sg/pdf/coronavirus-notice-hong-kong-protest.pdf\">here</a></p>`

function convertArrayToObj(arr) {
  return arr.reduce((a, elem) => ({ ...a, [elem[0]]: elem[1] }), {});
}

function objMap(obj, callback, validatorFn, levels=0) {
  if((typeof validatorFn === 'function' && validatorFn(obj)) || levels === 0)
    // must return [key, value] pair
    return convertArrayToObj(Object.entries(obj).map(callback));

  return objMap(obj, elem => {
    return [elem[0], objMap(elem[1], callback, validatorFn, levels - 1)]
  })
}

function main(){
  console.log(scootContents);

  function helper(entry){
    console.log('hit: ', entry[0]);
    console.log(Object.keys(entry[1]));
    console.log(entry[1].displayedBenefits && entry[1].displayedBenefits.supportMessage);
    // console.log(entry[1].displayedBenefits.supportMessage);
    return entry;
  }

  function validateObj(obj){
    const regex = /(^one_way$)|(^round_trip$)/;
    const result = Object.keys(obj).some(elem => regex.test(elem));
    // console.log('[validator]', Object.keys(obj), result)
    return result
  }

  const result = objMap(scootContents, helper, validateObj, 5);
  fs.writeFileSync('./result.json', JSON.stringify(result, null, 4));

  console.log('done!');
}

main();
