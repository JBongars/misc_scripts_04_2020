
const sleep = a => a;

const retryOnFail = async (promise, retry, sleeper) => {
  await sleeper();
  try {
    const result = await promise();
    return result;

  } catch(err){
    if(retry < 1){
      throw new Error(err);
    }

    console.error(err);
    return retryOnFail(promise, retry - 1, sleeper);
  }
}

const waterfallRequests = async (promises, results=[]) => {
  if(promises.length < 1){
    return results
  }
  
  const promise = promises.pop();
  const result = await promise();

  return waterfallRequests(promises, [...results, result]);
}

const persistentWaterfallRequests = async (promises, retry, sleeper) => {
  return waterfallRequests(
    promises.map(
      promise => () => retryOnFail(promise, retry, sleeper)
    )
  );
}

module.exports = {
  retryOnFail,
  waterfallRequests,
  persistentWaterfallRequests
}
