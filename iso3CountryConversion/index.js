// const countries = require("i18n-iso-countries");
// const enCountriesLocale = require("i18n-iso-countries/langs/en.json");

const fs = require("fs");

const countries = require("./countries.json"); //get region if country is not found
const axaCodes = require("./oldv3.json");
const missingIso3 = require("./missing-iso3.json");
const levenshtein = require("liblevenshtein");
const removeBrackets = / ?\([^\)]+\)/i;

console.log("start!");

const transducer = new levenshtein.Builder()
  .dictionary(
    axaCodes.map(elem =>
      elem.descriptionLong.replace(removeBrackets, "").toUpperCase()
    ),
    false
  ) // generate spelling candidates from unsorted completion_list
  .algorithm("transposition") // use Levenshtein distance extended with transposition
  .sort_candidates(true) // sort the spelling candidates before returning them
  .case_insensitive_sort(true) // ignore character-casing while sorting terms
  .include_distance(false) // just return the ordered terms (drop the distances)
  .maximum_candidates(10) // only want the top-10 candidates
  .build();

const MAX_SPELLING_MISTAKES = 0;

const finalResult = countries
  .map(country => {
    if (axaCodes.findIndex(elem2 => country["alpha-3"] === elem2.code) > -1) {
      return false;
    }

    const levenshtein = transducer
      .transduce(
        country.name.replace(removeBrackets, "").toUpperCase(),
        MAX_SPELLING_MISTAKES
      )
      .map(country =>
        axaCodes.filter(
          elem2 =>
            country ===
            elem2.descriptionLong.replace(removeBrackets, "").toUpperCase()
        )
      );

    return {
      // ...elem,
      name: country.name.replace(removeBrackets, ""),
      iso3: country["alpha-3"],
      // region: elem.region,
      ...(levenshtein[0] ? levenshtein[0][0] : {})
      // levenshtein
    };
  })
  .filter(elem => !!elem)
  .map(elem => (elem.code ? elem : { ...elem, code: "WWD" }));

let simplified = {};
finalResult.forEach(elem => {
  simplified[elem.iso3] = elem.code;
});

const countriesNotThere = finalResult
  .filter(elem => !Boolean(elem.descriptionLong))
  .map(elem => elem.iso3 + " - " + elem.name + " = " + elem.descriptionLong);

const countriesThere = finalResult
  .filter(elem => Boolean(elem.descriptionLong))
  .map(elem => elem.iso3 + " - " + elem.name + " = " + elem.descriptionLong);

fs.writeFileSync(
  "./countriesNotThedre.json",
  JSON.stringify(countriesNotThere, null, 2)
);
fs.writeFileSync(
  "./countriesThere.json",
  JSON.stringify(countriesThere, null, 2)
);

fs.writeFileSync("./result.json", JSON.stringify(finalResult));
fs.writeFileSync("./simplified.json", JSON.stringify(simplified, null, 2));

fs.writeFileSync(
  "./simplified-list.json",
  JSON.stringify(
    Object.keys(simplified).map(key => {
      const country = finalResult.find(elem => elem.iso3 === key);
      return `${key} - ${country.name}`;
    }),
    null,
    2
  )
);

// console.log("finalResult:", finalResult.length);
console.log("missingIso3: ", missingIso3.length);
console.log("simplified:", Object.keys(simplified).length);

console.log(
  "missing from simplified: ",
  missingIso3.filter(elem => !Boolean(simplified[elem]))
);

console.log(
  "missing from iso3: ",
  Object.keys(simplified).filter(
    elem =>
      missingIso3.findIndex(code => {
        // if (code == elem) console.log(code, " == ", elem);
        return code == elem;
      }) == -1
  )
);

console.log("done!");
