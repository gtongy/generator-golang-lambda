'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'baseName',
        message: 'What is the name of your application?',
        store: true,
        default: 'myapp'
      },
      {
        type: 'list',
        name: 'handlerName',
        message: 'What is the name to use handler?',
        choices: ['helloWorld'],
        default: 'helloWorld'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(`_handler_${this.props.handlerName}.go`),
      this.destinationPath(`${this.props.baseName}/handler.go`)
    );
    this.fs.copyTpl(
      this.templatePath(`_event_${this.props.handlerName}.json`),
      this.destinationPath(`${this.props.baseName}/event.json`)
    );
    this.fs.copyTpl(
      this.templatePath(`_Gopkg_${this.props.handlerName}.toml`),
      this.destinationPath(`${this.props.baseName}/Gopkg.toml`)
    );
    this.fs.copyTpl(
      this.templatePath(`_Makefile`),
      this.destinationPath(`${this.props.baseName}/Makefile`)
    );
  }
};
