'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const HelloWorldBoilerPlate = require('./boilerplates/hello-world');
const S3UploadBoilerPlates = require('./boilerplates/s3-upload');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const boilerplateIns = {
      helloWorld: new HelloWorldBoilerPlate('helloWorld'),
      s3Upload: new S3UploadBoilerPlates('s3Upload')
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
        name: 'boilerplate',
        message: 'What is the name to use boilerplate?',
        choices: [
          { name: 'Hello World', value: boilerplateIns.helloWorld },
          { name: 'S3 Upload', value: boilerplateIns.s3Upload }
        ],
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
