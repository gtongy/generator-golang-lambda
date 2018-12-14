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
        from: `${this.name}/_handler.go`,
        to: `${props.baseName}/handler.go`,
        needProps: false
      },
      {
        from: `${this.name}/_event.json`,
        to: `${props.baseName}/event.json`,
        needProps: false
      },
      {
        from: `${this.name}/_Gopkg.toml`,
        to: `${props.baseName}/Gopkg.toml`,
        needProps: false
      },
      {
        from: `${this.name}/_Makefile`,
        to: `${props.baseName}/Makefile`,
        needProps: true
      }
    ];
  }
};
