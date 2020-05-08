const _inquirer = require('inquirer');
const _inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt');
_inquirer.registerPrompt('autocomplete', _inquirerAutocompletePrompt);

module.exports = _inquirer;
