module.exports = class S3UploadBoilerPlate {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  hasDependencyCommand() {
    return this.hasDependencyCommand;
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
};
