'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

class HelloWorldOptions {
  getChoices() {
    return ['a', 'b'];
  }
}

class HelloWorldHandler {
  getName() {
    return 'Hello World';
  }

  getOptions() {
    return new HelloWorldOptions();
  }
}

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const handlerIns = {
      helloWorld: new HelloWorldHandler()
    };

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
        name: 'handler',
        message: 'What is the name to use handler?',
        choices: [{ name: 'Hello World', value: handlerIns.helloWorld }],
        default: handlerIns.helloWorld
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      return this.prompt([
        {
          type: 'list',
          name: 'handlerOption',
          message: `What function is ${props.handler.getName()} to use?`,
          choices: props.handler.getOptions().getChoices()
        }
      ]).then(props => {
        this.props.handlerOption = props.handlerOption;
      });
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
