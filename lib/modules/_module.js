//Default module class
export default class MODULE {
  constructor(node) {
    this.node = node
    //Default state of the module
    this.started = false
    //Is the module can be stopped
    this.isStoppable = true
  }

  init() {
    this.node.logger.info('Module ' + this.constructor.name + ' initialized')
    this.started = true
  }

  //Change the module state
  switch(value) {
    if (this.isStoppable) {
      this.started = value
      this.node.logger.info(
        'Module ' + this.constructor.name + ' state changed to: ' + value
      )
    }
  }
}
