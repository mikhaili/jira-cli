const inquirer = require('../ext-libs/inquirer');
const utils = require('../lib/utils');

module.exports = function (config) {
  function getAuthQuestions () {
    return [
      { type: 'input', name: 'url', message: 'Jira URL: ', validate: (input) => input.length > 0 },
      { type: 'input', name: 'user', message: 'Username: ', validate: (input) => input.length > 0 },
      { type: 'input', name: 'pass', message: 'Password/API token: ', validate: (input) => input.length > 0 }
    ];
  }

  function getClearConfigQuestion () {
    return { type: 'confirm', name: 'confirmDeleteConfig', message: 'Are you sure? ' };
  }

  return {
    generateToken: (user, pass) => Buffer.from(`${user}:${pass}`).toString('base64'),

    setup: function (options) {
      if (config.isLoaded()) {
        return;
      }

      const { template } = options;

      if (template && utils.isFileExists(template)) {
        console.log('Using cli supplied default config file');
        config.loadInitialFromTemplate(template);
      }

      inquirer.prompt(
        getAuthQuestions()
      ).then(answer => {
        const { err } = this.updateConfig(answer, options);
        if (err) {
          console.log(err);
          return err;
        }
        config.save();
        console.log('Information stored!!!');
      });
    },
    clearConfig: function () {
      inquirer
        .prompt(getClearConfigQuestion())
        .then(answer => {
          const { confirmDeleteConfig } = answer;
          if (confirmDeleteConfig) {
            config.clear();
            console.log('Configuration deleted successfully!');
          }
          process.stdin.destroy();
        });
    },
    updateConfig: function (configData, options) {
      if (!configData) {
        return { err: 'Config auth undefined' };
      }

      let { url, user, pass } = configData;

      if (!url || !user || !pass) {
        return { err: `Not all parameters were provided: url: ${url} user: ${user} pass: ${pass}` };
      }

      const { verbose } = options;
      const auth = {
        url: this.formatUrl(url),
        user: user,
        token: this.generateToken(user, pass)
      };

      if (verbose) {
        console.log(options);
        console.log(auth);
      }

      config.update('auth', auth);
    },
    printUrl: () => {
      console.log(config.auth ? config.auth.url : 'Please set config first');
    },
    formatUrl (url) {
      return (!/\/$/.test(url)) ? url + '/' : url;
    }
  };
};
