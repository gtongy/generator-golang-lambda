'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const HelloWorldBoilerPlate = require('./boilerplates/hello-world');
const S3UploadBoilerPlate = require('./boilerplates/s3-upload');
const awsRegions = require('aws-regions');

const boilerplates = {
  helloWorld: new HelloWorldBoilerPlate({
    name: 'helloWorld',
    needSetup: false
  }),
  s3Upload: new S3UploadBoilerPlate({
    name: 's3Upload',
    needSetup: true,
    awsRegions: awsRegions.list().map(awsRegion => {
      return { name: awsRegion.name, value: awsRegion.code };
    })
  })
};

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-golang-lambda')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'baseName',
        message: 'What is the name of your application?',
        default: 'myapp'
      },
      {
        type: 'list',
        name: 'boilerplate',
        message: 'What is the name to use boilerplate?',
        choices: [
          { name: 'Hello World', value: boilerplates.helloWorld },
          { name: 'S3 Upload', value: boilerplates.s3Upload }
        ],
        default: boilerplates.helloWorld
      }
    ];

    this.props = await this.prompt(prompts);
    this.props.boilerplateOptions = await this.prompt(
      this.props.boilerplate.getPrompts()
    );
  }

  writing() {
    this.props.boilerplate.getCopyFilePaths(this.props).forEach(filePath => {
      if (filePath.needProps) {
        this.fs.copyTpl(
          this.templatePath(filePath.from),
          this.destinationPath(filePath.to),
          { props: this.props }
        );
      } else {
        this.fs.copy(this.templatePath(filePath.from), this.destinationPath(filePath.to));
      }
    });
  }

  install() {
    const props = this.props;
    if (this.props.boilerplate.isNeedSetup()) {
      process.chdir(`./${props.baseName}`);
      this.props.boilerplate.getSetupCommands(props).forEach(setupCommand => {
        if (setupCommand.isExec) {
          this.spawnCommandSync(
            setupCommand.command,
            setupCommand.args,
            setupCommand.opts
          );
        }
      });
    }
  }
};
