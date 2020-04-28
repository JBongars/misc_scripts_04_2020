const _ = require('lodash');
const moment = require('moment');


const project = 'lodash playground';
const logger = {
  ...console,
  info: console.log,
  verbose: console.log,
}
const customMappings = { moment };

// taken from product-engine (to remove)
const mapData = (
  obj,
  template,
  useMustacheSyntax = true,
  parse = true,
  options = {},
) => {

  const rawSyntaxReplacer = (template, useMustacheSyntax) => {
    let myTemplate;
    if (useMustacheSyntax) {
      myTemplate = template.split('"#{{').join('{{').split('}}#"').join('}}');
    } else {
      myTemplate = template.split('"><%').join('<%').split('%><"').join('%>');
    }
    return myTemplate;
  };

  try {
    logger.verbose(`[${project}]Mapping the object`);

    // read about the usage of interpolate and evaluate
    // in the lodash doc: https://lodash.com/docs/4.17.11#template
    const interpolateDelimiterRegex =
      (useMustacheSyntax ? /{{([^{}%][\s\S]+?)}}/g : null) ||
      options.interpolate;
    const evaluateDelimiterRegex = useMustacheSyntax
      ? /{%([\s\S]+?)%}/g
      : options.evaluate;

    const newOptions = {
      interpolate: interpolateDelimiterRegex,
      evaluate: evaluateDelimiterRegex,
      ...options,
    };
    newOptions.imports = {
      custom: {
        ...customMappings,
      },
    };

    const tagStart = !useMustacheSyntax ? '<%' : '{%';
    const tagEnd = !useMustacheSyntax ? '%>' : '%}';
    const slash = '\\/\\/';
    const space = '\\s*';

    /**
     * Pattern: /"\/\/\d+":\s*"({%|{{|<#)(.*?)(%}|}}|#>)",?/g
     * @example: "//1": "<% if something === 1 %>",
     */
    const objectCommentPattern = new RegExp(
      `"${slash}\\d+": ${space}"${tagStart}(.*?)${tagEnd}"${space},?`,
      'g',
    );

    /**
     * Pattern: /"\/\/ ({%|{{|<#)(.*?)(%}|}}|#>)",?/g
     * @example: "// <% if something === 1 %>",
     */
    const stringCommentPattern = new RegExp(
      `"${slash} ${tagStart}(.*?)${tagEnd}",?`,
      'g',
    );

    const replacer = (__, expression) => `${tagStart}${expression}${tagEnd}`;

    let myTemplate = rawSyntaxReplacer(template, useMustacheSyntax);
    myTemplate = myTemplate.replace(objectCommentPattern, replacer);
    myTemplate = myTemplate.replace(stringCommentPattern, replacer);

    const compiled = _.template(myTemplate, newOptions);
    let result = compiled(obj);

    let deprecatedWarning = false;
    result = result.replace(/,\s*?"\\b"/g, match => {
      if (match) {
        deprecatedWarning = true;
      }
      return '';
    });
    if (deprecatedWarning) {
      logger.warn(
        `[${project}]The '\\b' modifier will be deprecated.Extra commas will be removed automatically.`,
      );
    }

    /**
     * Remove all extra commas
     * https://regex101.com/r/nz1jM8/1
     */
    result = result.replace(/(?<=[{[]\s*?),|,(?!\s*?[{["\w])/g, '');

    logger.verbose(`[${project}]Template compiled correctly`);

    if (parse) {
      logger.info(`[${project}]Parsing mapped object`);
      logger.verbose(result);

      return JSON.parse(result);
    }

    return result;
  } catch (err) {
    logger.error(`[${project}]Unexpected error mapping the object`);
    logger.error(err);

    throw new Error('Error mapping the object with the given template');
  }
};

const input = {
  policyNumber: 'test-policy-number',
  receiptNumber: 'test-receipt-number',
  initMsgId: 'testMessageNumber',
  partyId: 'testPartyId',
  ccAccountNumber: '123123123123',
  ccAccountType: 'V',
  ccExpiryDate: '2020-01-01',
  finalAmount: 100.21,
  finalAmountCurrency: 'SGD',
}

const options = {
  "useMustacheSyntax": true,
  "isString": false,
  "parse": true
}

const template = {
  "header": {
    "x-axa-lob": "GI",
    "x-axa-contextheader-customdata-targetsystem": "PSEA",
    "x-axa-initialmsgid": "{{ initMsgId }}",
    "x-axa-msgid": "{{ initMsgId }}"
  },
  "body": {
    "CreateReceiptRequest": {
      "receipt": {
        "receiptNumber": "{{ receiptNumber }}",
        "bankCode": "IA",
        "accountNumber": "{{ ccAccountNumber }}",
        "paymentMethodDate": "{{ custom.moment(ccExpiryDate, 'YYYY-MM-DD').format('YYYY-MM-DD') }}",
        "paymentMethodType": "{{ ccAccountType }}",
        "bankKey": "CREDITCARD",
        "printOfficialReceiptInd": "N",
        "paymentMethodCode": "N",
        "totalOriginalAmount": "{{ finalAmount.toFixed(2) }}",
        "totalOriginalCurrency": "{{ finalAmountCurrency }}",
        "paymentLineItem": [
          {
            "subAccountCode": "FG",
            "subAccountType": "PP",
            "transactionDescription": "*",
            "originalAmount": "{{ finalAmount.toFixed(2) }}",
            "policyNumber": "{{ policyNumber }}"
          }
        ],
        "payee": {
          "partyTypeCode": "CN",
          "partyId": "{{ partyId }}"
        }
      }
    }
  }
};

const output = mapData(input, JSON.stringify(template, null, 2), true, true, options);

console.log("FINAL OUTPUT:");
console.log(JSON.stringify(output, null, 2))
