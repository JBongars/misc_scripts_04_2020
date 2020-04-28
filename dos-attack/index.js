const request = require("request-promise");

const uri = "https://uat.axa.com.sg/travel-insurance/buy/api/quotation";
const method = "PUT";
const payload = {
  startDate: "2019-01-29",
  endDate: "2019-02-05",
  policyType: "SingleTrip",
  destinations: ["FRA"],
  adultCount: 1,
  childCount: 0
};
const headers = {
  "Referrer Policy": "no-referrer-when-downgrade"
};

const mkreq = () =>
  request({
    method,
    //   headers,
    preambleCRLF: true,
    postambleCRLF: true,
    uri,
    form: payload
  });

console.log(Array);

Promise.all(Array(100))
  .then(response => {
    console.log("Upload successful!  Server responded with:", response);
  })
  .catch(err => {
    return console.error("upload failed:", err);
  });
