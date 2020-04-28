
const obj = {
  normalRange: 'Sheet!F4',
  range: 'Sheet!F2:G5'
}

const validationRegex = /:/;
const sheetRegex = /^[\w\d]+\!/i;
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const convertLetterAddress = (hex) => alphabet.findIndex(elem => elem === hex);

const parseRanges = (rangeString) => {
  const sheet = rangeString.match(sheetRegex);
  const [rangeFrom, rangeTo] = rangeString
    .replace(sheet, '')
    .replace('$', '')
    .split(':')
    .map(elem => [
      convertLetterAddress(elem.match(/[A-Z]+/)[0]),
      parseInt(elem.match(/\d+/))
    ]);

  const result = [];

  for (i = rangeFrom[1]; i <= rangeTo[1]; i++) {
    for (j = rangeFrom[0]; j <= rangeTo[0]; j++) {
      result.push([`[${i - rangeFrom[1] + 1}][${j - rangeFrom[0] + 1}]`, `${sheet}${alphabet[j]}${i}`])
      // result.push(`${sheet}${alphabet[j]}${i}`);
    }
  }

  return result;
}

const parseInputs = inputObj => Object.entries(inputObj).map(elem => {
  if (validationRegex.test(elem[1])) {
    return [elem[0], parseRanges(elem[1])];
  }
  return elem;
})
  .reduce(
    (arr, elem) => (
      [
        ...arr,
        ...(
          Array.isArray(elem[1]) ?
            elem[1].map(
              (elem2, i) => ([`${elem[0]}${elem2[0]}`, elem2[1]])
            ) : [elem]
        )
      ]
    ), []
  )
  .reduce((arr, elem) => ({ ...arr, [elem[0]]: elem[1] }), {});

const result = parseInputs(obj);
console.log('result is: ');
console.log(result);
