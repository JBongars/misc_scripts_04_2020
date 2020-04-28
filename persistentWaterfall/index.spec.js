
const {retryOnFail, waterfallRequests} = require('.');

console.error = jest.fn();

describe('# Persistent Waterfall', () => {
  
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('## Retry on Fail', () => {
      

    it('should resolve a promise if no errors are generated', async () => {
      const promiseMock = jest.fn().mockResolvedValue('success');
      const sleeperMock = jest.fn();
      const result = await retryOnFail(promiseMock, 5, sleeperMock);

      expect(sleeperMock).toBeCalled();
      expect(promiseMock).toBeCalledTimes(1);
      expect(result).toEqual('success');
    });

    it('should reject a promise that rejects after 5 retries', async () => {
      const promiseMock = jest.fn().mockRejectedValue('failure');
      const sleeperMock = jest.fn();
      expect.assertions(2);

      try{
        await retryOnFail(promiseMock, 5, sleeperMock);
      } catch(err) {
        expect(err.message).toEqual('failure');
      }
      expect(sleeperMock).toBeCalled();
    });

    it('should resolve a promise that rejected the first 3 times and resolved after', async () => {
      const sleeperMock = jest.fn();
      const promiseMock = jest.fn()
        .mockResolvedValue('success')
        .mockRejectedValueOnce('failure')
        .mockRejectedValueOnce('failure')
        .mockRejectedValueOnce('failure');

      const result = await retryOnFail(promiseMock, 5, sleeperMock);
      
      expect(sleeperMock).toBeCalled();
      expect(promiseMock).toBeCalledTimes(4);
      expect(result).toEqual('success');
    });

  });

  describe('## Waterfall Promises', () => {

    it('should waterfall promises in order', async () => {
      let orderCalled = [];
      const generatePromiseMock = (flag) => () => {
        orderCalled.push(flag);
        return flag;
      };
  
      const flags =  ['a','b','c','d','e'];
      const promisesMock = flags.map(generatePromiseMock);
      const result = await waterfallRequests(promisesMock);
  
      flags.reverse();
  
      expect(orderCalled).toEqual(flags);
      expect(result).toEqual(flags);
    });
  });
});
