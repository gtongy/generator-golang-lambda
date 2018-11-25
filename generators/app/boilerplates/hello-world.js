module.exports = class HelloWorldBoilerPlate {
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

  getCopyTemplateFilePaths(props) {
    return [{ from: `_Makefile`, to: `${props.baseName}/Makefile` }];
  }
};
