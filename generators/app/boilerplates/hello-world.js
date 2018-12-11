module.exports = class HelloWorldBoilerPlate {
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
      }
    ];
  }

  getCopyFilePaths(props) {
    return [
      {
        from: `_handler_${this.name}.go`,
        to: `${props.baseName}/handler.go`,
        needProps: false
      },
      {
        from: `_event_${this.name}.json`,
        to: `${props.baseName}/event.json`,
        needProps: false
      },
      { from: `_Gopkg.toml`, to: `${props.baseName}/Gopkg.toml`, needProps: false },
      { from: `_Makefile`, to: `${props.baseName}/Makefile`, needProps: true }
    ];
  }
};
