

function objToSchma(obj, options, strict = true) {

  const transformArrToObj = (arr, cb) => arr.reduce(
    (a, elem) => ({
      ...(typeof a === 'undefined' ? {} : a),
      [elem]: cb(elem)
    }), {}
  )

  const getObjectSchema = objChild => {
    const requiredKeys = (strict ? Object.keys(objChild) : []);

    return {
      type: "object",
      properties: transformArrToObj(Object.keys(objChild), key => {
        const elem = objChild[key];

        if (Array.isArray(elem)) {
          return { type: "object" }
        }

        if (elem === null) {
          return { type: "string" }
        }

        if (typeof elem === 'undefined') {
          return { type: "string" }
        }

        switch (typeof elem) {
          case 'object':
            return getObjectSchema(elem);
          default:
            return { type: typeof elem }
        }
      }),
      required: requiredKeys,
      errorMessage: {
        required: transformArrToObj(Object.keys(objChild), elem => `${elem} is a required field`)
      }
    }
  }

  return {
    type: "jsonSchema",
    isString: false,
    schema: getObjectSchema(obj),
    errorMessage: {},
    additionalProperties: true,
    ...options
  }
}