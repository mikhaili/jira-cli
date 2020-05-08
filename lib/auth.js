const inquirer = require('../ext-libs/inquirer');
const utils = require('../lib/utils');

module.exports = function (config) {
  function formatUrl (url) {
    if (!/\/$/.test(url)) {
      url += '/';
    }
    return url;
  }

  function getAuthQuestions () {
    return [
      { type: 'input', name: 'url', message: 'Jira URL: ', validate: (input) => input.length > 0 },
      { type: 'input', name: 'user', message: 'Username: ', validate: (input) => input.length > 0 },
      { type: 'input', name: 'pass', message: 'Password: ', validate: (input) => input.length > 0 }
    ];
  }

  function getClearConfigQuestion () {
    return { type: 'confirm', name: 'confirmDeleteConfig', message: 'Are you sure? ' };
  }

  return {
    setup: function (options) {
      if (config.isLoaded()) {
        return;
      }
      inquirer.prompt(
        getAuthQuestions()
      ).then(answer => {
        this.saveConfig(answer, options);
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
    saveConfig: function (configData, options) {
      let { url, user, pass } = configData;
      const { verbose, template } = options;

      if (!url || !user || !pass) {
        if (options.verbose) {
          console.log(`not all params provided: url: ${url} user: ${user} pass: ${pass}`);
        }
        return;
      }

      if (verbose) {
        console.log(options);
      }

      if (template && utils.isFileExists(template)) {
        console.log('Using cli supplied default config file');
        config.loadInitialFromTemplate(template);
      }

      const auth = {
        url: formatUrl(url),
        user: user,
        token: Buffer.from(`${user}:${pass}`).toString('base64')
      };
      console.log(auth);

      config.update('auth', auth);
      config.save();
      console.log('Information stored!');
    },
    printUrl: () => {
      console.log(config.auth ? config.auth.url : 'Please set config first');
    }
  };
};
