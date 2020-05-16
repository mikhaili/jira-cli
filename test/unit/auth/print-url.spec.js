const Auth = require('../../../lib/auth');

describe('auth api printUrl', () => {
  let log;
  beforeEach(() => {
    log = jest.spyOn(global.console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    log.mockRestore();
  });

  ['great-url.com', undefined].forEach((url) => {
    it(`should print config url, when call ${url}`, function () {
      // Arrange
      const auth = new Auth({ auth: { url: url } });
      // Action
      auth.printUrl();
      // Assert
      expect(log).toHaveBeenLastCalledWith(url);
    });
  });

  it('should print error message, when config not set', function () {
    // Arrange
    const auth = new Auth({});
    // Action
    auth.printUrl();
    // Assert
    expect(log).toHaveBeenLastCalledWith('Please set config first');
  });
});


