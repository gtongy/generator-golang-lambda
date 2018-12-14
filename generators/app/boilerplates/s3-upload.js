module.exports = class S3UploadBoilerPlate {
  constructor(opts) {
    this.name = opts.name;
    this.needSetup = opts.needSetup;
    this.awsRegions = opts.awsRegions;
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
        type: 'list',
        name: 'region',
        message: 'What is the aws region company?',
        choices: this.awsRegions
      },
      {
        type: 'input',
        name: 'uploadBucketName',
        message: 'What is the upload bucket name?',
        default: 'upload-bucket'
      },
      {
        type: 'input',
        name: 'eventTriggerBucketName',
        message: 'What is the event trigger bucket name?',
        default: 'event-trigger-bucket'
      },
      {
        type: 'input',
        name: 'endpoint',
        message: 'What is the endpoint?',
        default: 'http://minio:9000'
      },
      {
        type: 'confirm',
        name: 'execDepEnsure',
        message: 'Would you like to exec dep ensure? (default: Yes)',
        default: true
      },
      {
        type: 'confirm',
        name: 'isCreateImages',
        message: 'Would you like to create images? (default: Yes)',
        default: true
      },
      {
        type: 'confirm',
        name: 'isBuildLocalS3Container',
        message: 'Would you like to build local s3 docker container? (default: Yes)',
        default: true
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
      { from: '_file.go', to: `${props.baseName}/file.go`, needProps: false },
      {
        from: '_create-images.sh',
        to: `${props.baseName}/create-images.sh`,
        needProps: false
      },
      { from: '_Gopkg.toml', to: `${props.baseName}/Gopkg.toml`, needProps: false },
      { from: '_Makefile', to: `${props.baseName}/Makefile`, needProps: true },
      {
        from: `_handler_${this.name}.go`,
        to: `${props.baseName}/handler.go`,
        needProps: true
      },
      { from: '_s3.go', to: `${props.baseName}/s3.go`, needProps: true },
      {
        from: `_event_${this.name}.json`,
        to: `${props.baseName}/event.json`,
        needProps: true
      },
      {
        from: 'minio/_docker-compose.yml',
        to: `${props.baseName}/minio/docker-compose.yml`,
        needProps: true
      }
    ];
  }

  getSetupCommands(props) {
    return [
      {
        command: 'dep',
        args: ['ensure'],
        isExec: props.boilerplateOptions.execDepEnsure,
        opts: {}
      },
      {
        command: 'make',
        args: [
          'create-images',
          `FILE_COUNTS=${props.boilerplateOptions.fileCounts}`,
          `FILE_SIZE=${props.boilerplateOptions.fileSize}`
        ],
        isExec: props.boilerplateOptions.isCreateImages,
        opts: {}
      },
      {
        command: 'make',
        args: ['zip-images', 'START=1', `END=${props.boilerplateOptions.fileCounts}`],
        isExec: props.boilerplateOptions.isCreateImages,
        opts: {}
      },
      {
        command: 'make',
        args: ['minio-create-network'],
        isExec: props.boilerplateOptions.isBuildLocalS3Container,
        opts: {}
      },
      {
        command: 'make',
        args: ['minio-up'],
        isExec: props.boilerplateOptions.isBuildLocalS3Container,
        opts: {}
      }
    ];
  }
};
