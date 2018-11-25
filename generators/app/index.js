'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

class HelloWorldHandler {
  constructor(name) {
    this.name = name;
  }

  getPrompts() {
    return [
      {
        type: 'input',
        name: 'memorySize',
        message: 'What size is this lambda memory?',
        default: '128'
      }
    ];
  }

  getCopyFilePaths(props) {
    return [
      { from: `_handler_${this.name}.go`, to: `${props.baseName}/handler.go` },
      { from: `_event_${this.name}.json`, to: `${props.baseName}/event.json` },
      { from: `_Gopkg_${this.name}.toml`, to: `${props.baseName}/Gopkg.toml` }
    ];
  }

  getCopyTemplateFilePath(props) {
    return [{ from: `_Makefile`, to: `${props.baseName}/Makefile` }];
  }
}

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const handlerIns = {
      helloWorld: new HelloWorldHandler('helloWorld')
    };
    // TODO: aws credential export env promts append.
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
      return this.prompt(props.handler.getPrompts()).then(props => {
        this.props.handlerOptions = props;
      });
    });
  }

  writing() {
    const props = this.props;
    this.props.handler.getCopyFilePaths(props).map(filePath => {
      return this.fs.copy(
        this.templatePath(filePath.from),
        this.destinationPath(filePath.to)
      );
    });
    this.props.handler.getCopyTemplateFilePath(props).map(filePath => {
      return this.fs.copyTpl(
        this.templatePath(filePath.from),
        this.destinationPath(filePath.to),
        {
          props: props
        }
      );
    });
  }
};
