module.exports = class S3UploadBoilerPlate {
  constructor(opts) {
    this.name = opts.name;
    this.needSetup = opts.needSetup;
  }

  isNeedSetup() {
    return this.needSetup;
  }

  getName() {
    return this.name;
  }

  getPrompts() {
    return [
      {
        type: 'input',
        name: 'memorySize',
        message: 'What size is this lambda memory?',
        default: '128'
      },
      {
        type: 'confirm',
        name: 'isLaunchLocalstack',
        message: 'Would you like to launch localstack? (default: No)',
        default: false
      },
      {
        type: 'confirm',
        name: 'isCreateImages',
        message: 'Would you like to create images? (default: No)',
        default: false
      },
      {
        type: 'input',
        name: 'fileCounts',
        message: 'How many images will you create?',
        default: '10',
        when: answer => {
          return answer.isCreateImages;
        }
      },
      {
        type: 'input',
        name: 'fileSize',
        message: 'What is the size of one image?(KB)',
        default: 100,
        when: answer => {
          return answer.isCreateImages;
        }
      }
    ];
  }

  getCopyFilePaths(props) {
    return [
      { from: `_handler_${this.name}.go`, to: `${props.baseName}/handler.go` },
      { from: `_s3.go`, to: `${props.baseName}/handler.go` },
      { from: `_file.go`, to: `${props.baseName}/file.go` },
      { from: `_create-images.sh`, to: `${props.baseName}/create-images.sh` },
      { from: `_event_${this.name}.json`, to: `${props.baseName}/event.json` },
      { from: `_Gopkg.toml`, to: `${props.baseName}/Gopkg.toml` }
    ];
  }

  getCopyTemplateFilePaths(props) {
    return [{ from: `_Makefile`, to: `${props.baseName}/Makefile` }];
  }

  getSetupCommands(props) {
    return [
      {
        command: `make`,
        args: [`launch-localstack`],
        isExec: props.boilerplateOptions.isLaunchLocalstack,
        opts: {}
      },
      {
        command: `make`,
        args: [
          `create-images`,
          `FILE_COUNTS=${props.boilerplateOptions.fileCounts}`,
          `FILE_SIZE=${props.boilerplateOptions.fileSize}`
        ],
        isExec: props.boilerplateOptions.isCreateImages,
        opts: {}
      }
    ];
  }
};
