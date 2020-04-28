const searchByString = (target: unknown, key: string): unknown => {
  const keyList: string[] = `.${key}`
    .match(/(\.[\w\d]+)|(\[\d+\])|(\['[^']*'\])|(\["[^"]*"\])/g)
    .map(
      (elem: string): string =>
        elem.replace(/(^\[("|')?)|(("|')?\]$)|(^\.)/g, ''),
    );

  function helper(innerTarget: unknown, innerKeyList: string[]): unknown {
    if (innerKeyList.length === 0) return innerTarget;
    const keyString: string = innerKeyList.shift();
    let nextTarget: unknown;
    try {
      nextTarget = innerTarget[keyString];
    } catch (err) {
      throw new Error(
        `Property ${keyString} cannot be found in ${innerTarget}`,
      );
    }

    const result: unknown = helper(nextTarget, keyList);
    return result;
  }
  return helper(target, keyList);
};

export default searchByString;
export { searchByString };
