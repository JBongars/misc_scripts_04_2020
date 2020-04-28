const fetch = require('node-fetch');

const main = async () => {
  console.log('start');

  const result = await fetch('https://kong-int.axa-sg-preprod-mpl-int.pink.ap-southeast-1.aws.openpaas.axa-cloud.com/v2/email', { method: "GET" });
  console.log(result);

}

main();
