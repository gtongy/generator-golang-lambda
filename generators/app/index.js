'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const HelloWorldBoilerPlate = require('./boilerplates/hello-world');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const boilerplateIns = {
      helloWorld: new HelloWorldBoilerPlate('helloWorld')
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
        name: 'boilerplate',
        message: 'What is the name to use boilerplate?',
        choices: [{ name: 'Hello World', value: boilerplateIns.helloWorld }],
        default: boilerplateIns.helloWorld
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      return this.prompt(props.boilerplate.getPrompts()).then(props => {
        this.props.boilerplateOptions = props;
      });
    });
  }

  writing() {
    const props = this.props;
    this.props.boilerplate.getCopyFilePaths(props).map(filePath => {
      return this.fs.copy(
        this.templatePath(filePath.from),
        this.destinationPath(filePath.to)
      );
    });
    this.props.boilerplate.getCopyTemplateFilePaths(props).map(filePath => {
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
