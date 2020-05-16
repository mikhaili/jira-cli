const Auth = require('../../../lib/auth');
const config = require('../../../lib/config');

jest.mock('../../../lib/config');

describe('auth api updateConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update config when valid config data provided', () => {
    const spyUpdate = jest.spyOn(config, 'update');

    const auth = new Auth(config);
    const configData = { url: 'https://great-url.com', pass: 'strong-pass', user: 'smart-user' };
    const option = {};
    auth.updateConfig(configData, option);

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
    { url: 'strong-pass', user: 'smart-user' },
    { url: 'strong-pass', pass: 'smart-user' },
    undefined
  ].forEach((data) => {
    it('should return error when some data not provided', () => {
      const auth = new Auth(config);
      const option = {};
      const { err } = auth.updateConfig(data, option);

      expect(err).toBeDefined();
      expect(config.update).not.toHaveBeenCalled();
    });
  });
});

