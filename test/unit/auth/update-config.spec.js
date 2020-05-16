const Auth = require('../../../lib/auth');
const config = require('../../../lib/config');

jest.mock('../../../lib/config');

describe('auth api updateConfig', () => {
  let auth;
  beforeEach(() => {
    auth = new Auth(config);
    jest.clearAllMocks();
  });

  it('should update config when valid config data provided', () => {
    // Arrange
    const spyUpdate = jest.spyOn(config, 'update');
    const configData = { url: 'https://good-url.com', pass: 'strong-pass', user: 'smart-user' };
    const option = {};
    // Action
    auth.updateConfig(configData, option);
    // Assert
    expect(config.update).toHaveBeenCalledWith(
      'auth', {
        url: auth.formatUrl(configData.url),
        user: configData.user,
        token: auth.generateToken(configData.user, configData.pass)
      }
    );
    spyUpdate.mockRestore();
  });

  [
    { pass: 'strong-pass', user: 'smart-user' },
    { url: 'https://good-url.com', user: 'smart-user' },
    { url: 'https://good-url.com', pass: 'smart-user' },
    undefined
  ].forEach((data, index) => {
    it('should return error, when some data not provided failed on ' + index, () => {
      // Arrange
      const option = {};
      // Action
      const { err } = auth.updateConfig(data, option);
      // Assert
      expect(err).toBeDefined();
      expect(config.update).not.toHaveBeenCalled();
    });
  });
});

